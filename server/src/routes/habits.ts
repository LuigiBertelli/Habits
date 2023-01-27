import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import dayjs from 'dayjs'

export async function appHabitsRoutes(app: FastifyInstance) {
    app.post('/:userId/habit', async (req) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6))
        })

        const createHabitParams = z.object({
            userId: z.string().uuid(),
        })

        const { userId } = createHabitParams.parse(req.params)

        const { title, weekDays} = createHabitBody.parse(req.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                user_id: userId,
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {week_day: weekDay}
                    })
                }
            }
        })
    })

    app.get('/:userId/day', async(req) => {
        const getDayParams = z.object({
            userId: z.string().uuid(),
        })

        const getDayQueryParams = z.object({
            date: z.coerce.date()
        })

        const { userId } = getDayParams.parse(req.params)
        const { date } = getDayQueryParams.parse(req.query)

        const parsedDate = dayjs(date).startOf('day').toDate()
        const weekDay = dayjs(parsedDate).get('day')

        const possibleHabits = await prisma.habit.findMany({
            where: {
                user_id: userId,
                created_at: {
                    lte: parsedDate
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date_user_id: {
                    date: parsedDate,
                    user_id: userId
                }
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => dayHabit.habit_id) ?? []

        return {
            possibleHabits,
            completedHabits
        }
    })

    app.patch('/:userId/habits/:id/toggle', async(req) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid(),
            userId: z.string().uuid(),
        })

        const { id, userId } = toggleHabitParams.parse(req.params)

        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where: {
                date_user_id: {
                    user_id: userId,
                    date: today
                }
            }
        })

        if(!day) {            
            day = await prisma.day.create({
                data: {
                    date: today,
                    user_id: userId
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id, 
                    habit_id: id
                }
            }
        })

        if(dayHabit) {
            await prisma.dayHabit.delete({
                where : {
                    id: dayHabit.id
                }
            })
        } else {
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }
        
    })

    app.get('/:userId/summary', async(req) => {

        const summaryParams = z.object({
            userId: z.string().uuid()
        })

        const { userId } = summaryParams.parse(req.params)
        
        const summary = prisma.$queryRaw`
            SELECT 
                D.id, 
                D.date,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM day_habit DH
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                SELECT
                    cast(count(*) as float)
                FROM habit_week_days HDW
                JOIN habits H
                    ON H.id = HDW.habit_id
                WHERE
                    HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                    AND H.created_at <= D.date
                    AND H.user_id = D.user_id
                ) as amount
            FROM days D
            WHERE D.user_id = ${userId}
            `



        return summary
    })
}