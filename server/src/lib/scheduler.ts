import nodeCron from 'node-cron'
import PushManager from 'web-push'

import { prisma } from '../lib/prisma'

type userNotifications = {
    endpoint: string,
    auth: string,
    p256dh: string,
    expiration_time?: Date,
    user_id?: string
}

export function scheduleDiaryNotifications() {
    console.log('Starting Diary Notifications Scheduler')

    const task = nodeCron.schedule('0 19 * * *', async() => {
        const subs = await prisma.$queryRaw`
            SELECT 
                un.endpoint,
                un.auth,
                un.p256dh
            FROM users_notification un
                INNER JOIN users u ON u.id = un.user_id
            WHERE (un.expiration_date IS NULL OR un.expiration_date > DATE())
                AND DATE(u.last_login) != DATE()
                AND DATE(u.last_login, '+10days') >= DATE()
        ` as userNotifications[]

        subs.map(sub => {
            PushManager.sendNotification({
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh
                }
            }, 'Habits')
        })
    } )

    task.start()

    console.log('Diary Notifications Scheduled')
}