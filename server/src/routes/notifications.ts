import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import PushManager from 'web-push'
import { z } from 'zod'
import dayjs from 'dayjs'
import nodeCron from 'node-cron'

const publicKey = 'BHolOnybF474DaQ-CXDbZuqpisesDX-5wGzoQP3duvtz5J6gPdHl78T2VkoRJ2QhPqtPJ3fBO-PQRVYHowU888s'
const privateKey = '-BBw45ddR6af-M2FG5uDUJL1LrqnjZMmBL5NcVA4gMA'

PushManager.setVapidDetails('http://localhost:3333', publicKey, privateKey)

type userNotifications = {
    endpoint: string,
    auth: string,
    p256dh: string,
    expiration_time?: Date,
    user_id?: string
}

export async function appNotificationsRoutes(app: FastifyInstance) {
    app.get('/notifications/public_key', () => ({publicKey}))

    app.post('/notifications/subscribe', async(req, res) => {
        const subscribeBody = z.object({
            userId: z.undefined(z.string().uuid()),
            subscription: z.object({
                endpoint: z.string(),
                expirationTime: z.number().nullable(),
                keys: z.object({
                    p256dh: z.string(),
                    auth: z.string()
                })
            })
        })
        const { subscription, userId } = subscribeBody.parse(req.body)

        let data = {
            endpoint: subscription.endpoint,
            auth: subscription.keys.auth,
            p256dh: subscription.keys.p256dh,
        } as userNotifications

        if(typeof userId !== 'undefined')
            data.user_id = userId 

        if(subscription.expirationTime) {
            const expiration = dayjs().add(subscription.expirationTime).toDate()
            data.expiration_time = expiration
        }

        const notification = await prisma.usersNotification.create({
            data
        });

        return res.status(201).send({notification_id: notification.id})
    })

    app.patch('/notifications/vinculate-user',async (req) => {
        const vinculateUserBody = z.object({
            userId: z.string().uuid(),
            notificationId: z.string().uuid()
        })

        const { userId, notificationId } = vinculateUserBody.parse(req.body)

        await prisma.usersNotification.update({
            where: {
                id: notificationId
            },
            data: {
                user_id: userId
            }
        })
    })

    app.post('/notifications/push', async(req) => {
        const subscribeBody = z.object({
            message: z.string()
        })

        const subs = await prisma.usersNotification.findMany()
        const { message } = subscribeBody.parse(req.body)

        subs.map(sub => {
            PushManager.sendNotification({
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh
                }
            }, message)
        })
    })

    app.post('/notifications/push/:userId', async(req) => {
        const pushNotificationByUserParam = z.object({
            userId: z.string().uuid()
        })

        const { userId } = pushNotificationByUserParam.parse(req.params)

        const subscribeBody = z.object({
            message: z.string()
        })

        const { message } = subscribeBody.parse(req.body)

        const subs = await prisma.usersNotification.findMany({
            where: {
                user_id: userId
            }
        })
        
        subs.map(sub => {
            PushManager.sendNotification({
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh
                }
            }, message)
        })
    })
}