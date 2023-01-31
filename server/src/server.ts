import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appHabitsRoutes } from './routes/habits'
import { appUsersRoutes } from './routes/users'
import { appNotificationsRoutes } from './routes/notifications'
import { scheduleDiaryNotifications } from './lib/scheduler'
const app = Fastify()

scheduleDiaryNotifications()
app.register(cors)
app.register(appHabitsRoutes)
app.register(appUsersRoutes)
app.register(appNotificationsRoutes)

app.listen({
    port: 3333,
    host: '0.0.0.0'
})
    .then(() => console.log('HTTP Server Running!'))