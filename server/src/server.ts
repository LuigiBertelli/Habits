import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appHabitsRoutes } from './routes/habits'
import { appUsersRoutes } from './routes/users'

const app = Fastify()


app.register(cors)
app.register(appHabitsRoutes)
app.register(appUsersRoutes)

app.listen({
    port: 3333,
    host: '0.0.0.0'
})
    .then(() => console.log('HTTP Server Running!'))