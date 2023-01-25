import { prisma } from './lib/prisma'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'

import { generatePasswordAlias } from './utils/generate-passwords-alias'

export async function appRoutes(app: FastifyInstance) {
    app.post('/habit', async (req) => {
        const createHabitBody = z.object({
            userId: z.string().uuid(),
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6))
        })

        const { userId, title, weekDays} = createHabitBody.parse(req.body)

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

    app.get('/day', async(req) => {
        const getDayParams = z.object({
            userId: z.string().uuid(),
            date: z.coerce.date()
        })

        const { userId, date } = getDayParams.parse(req.query)

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
                date: parsedDate
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

    app.patch('/habits/:id/toggle', async(req) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid()
        })

        const {id} = toggleHabitParams.parse(req.params)

        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })

        if(!day) {            
            day = await prisma.day.create({
                data: {
                    date: today
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

    app.get('/summary', async(req) => {

        const summaryParams = z.object({
            userId: z.string().uuid()
        })

        const { userId } = summaryParams.parse(req)
        
        const summary = prisma.$queryRaw`
            SELECT
                d.id,
                d.date,
                CAST(COUNT(dh.id) AS float) completed,
                CAST(COUNT(h.id) AS float) amount
            FROM days d
                LEFT JOIN day_habit dh ON dh.day_id = d.id
                LEFT JOIN habit_week_days hwd ON hwd.week_day = CAST(strftime('%w', d.date /1000.0, 'unixepoch') AS int )
                INNER JOIN habits h ON h.id = hwd.habit_id AND h.created_at <= d.date
            WHERE
                d.user_id = '${userId}'
            GROUP BY d.id
        `

        return summary
    })

    app.post('/signin', async(req) => {
        const signinParams = z.object({
            email: z.string().email(),
            password: z.string(),
            name: z.string().trim()
        })

        const { email, password, name} = signinParams.parse(req.body)
        const created_at = dayjs().toDate()

        const cryptedPswd = await bcrypt.hash(generatePasswordAlias(email, created_at.toString(), password), await bcrypt.genSalt(8));

        console.log({
            name,
            password: cryptedPswd,
            email,
            created_at
        });

        await prisma.users.create({
            data: {
                name,
                password: cryptedPswd,
                email,
                created_at
            }
        })
    })

    app.get('/login', async(req) => {
        const loginParams = z.object({
            email: z.string().email(),
            password: z.string()
        })

        const { email, password } = loginParams.parse(req.query)  
        const user = await prisma.users.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                created_at: true,
                password: true
            }
        })

        if(user) {
            const pswdIsEqual = await bcrypt.compare(generatePasswordAlias(email, user.created_at.toString(), password), user.password);

            console.log(user.password)
            if(pswdIsEqual)
                return { user_id: user.id }
        }
    })
}