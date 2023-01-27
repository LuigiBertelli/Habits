import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const firstUser = {
  id: '4cf5f0a9-e38a-4e70-871c-3da22561e9e0',
  email: 'berteluigi@gmail.com',
  name: 'Luigi Ferreira Bertelli',
  password: '$2b$08$8Z.eC/jFx4c6orxyhWZUD.TcXoQUqXlUTQobAm8K5sN1tnpmz.o2m',
  created_at: new Date('2023-01-25T20:38:32.520Z')
};

const firstHabitId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
const firstHabitCreationDate = new Date('2022-12-31T03:00:00.000')

const secondHabitId = '00880d75-a933-4fef-94ab-e05744435297'
const secondHabitCreationDate = new Date('2023-01-03T03:00:00.000')

const thirdHabitId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00'
const thirdHabitCreationDate = new Date('2023-01-08T03:00:00.000')

async function run() {
  await prisma.habitWeekDays.deleteMany()
  await prisma.dayHabit.deleteMany()
  await prisma.habit.deleteMany()
  await prisma.day.deleteMany()
  await prisma.users.deleteMany()

  /**
   * Create habits
   */
  await Promise.all([
    prisma.users.create({
      data: {
        ...firstUser,
        habits: {
          create: [
            {
              id: firstHabitId,
              title: 'Beber 2L água',
              created_at: firstHabitCreationDate,
              weekDays: {
                create: [
                  { week_day: 1 },
                  { week_day: 2 },
                  { week_day: 3 },
                ]
              },
              
            },
            {
              id: secondHabitId,
              title: 'Exercitar',
              created_at: secondHabitCreationDate,
              weekDays: {
                create: [
                  { week_day: 3 },
                  { week_day: 4 },
                  { week_day: 5 },
                ]
              }
            },
            {
              id: thirdHabitId,
              title: 'Dormir 8h',
              created_at: thirdHabitCreationDate,
              weekDays: {
                create: [
                  { week_day: 1 },
                  { week_day: 2 },
                  { week_day: 3 },
                  { week_day: 4 },
                  { week_day: 5 },
                ]
              }
            },
          ]
        },
        days: {
          create: [
            /**
             * Habits (Complete/Available): 1/1
             */
            {
              /** Monday */
              date: new Date('2023-01-02T23:00:00.000z'),
              dayHabits: {
                create: {
                  habit_id: firstHabitId,
                }
              }
            },
            /**
             * Habits (Complete/Available): 1/1
             */
            {
              /** Friday */
              date: new Date('2023-01-06T23:00:00.000z'),
              dayHabits: {
                create: {
                  habit_id: firstHabitId,
                }
              }
            },
            /**
             * Habits (Complete/Available): 2/2
             */
            {
              /** Wednesday */
              date: new Date('2023-01-04T23:00:00.000z'),
              dayHabits: {
                create: [
                  { habit_id: firstHabitId },
                  { habit_id: secondHabitId },
                ]
              }
            }
          ]
        }
      }
    })
  ])

}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })