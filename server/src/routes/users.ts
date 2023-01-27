import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'

import { generatePasswordAlias } from '../utils/generate-passwords-alias'

export async function appUsersRoutes(app: FastifyInstance) {

    app.post('/signup', async(req) => {
        const signupParams = z.object({
            email: z.string().email(),
            password: z.string(),
            name: z.string().trim()
        })

        const { email, password, name} = signupParams.parse(req.body)
        const created_at = dayjs().toDate()

        const cryptedPswd = await bcrypt.hash(generatePasswordAlias(email, created_at.toString(), password), await bcrypt.genSalt(8));

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

            if(pswdIsEqual)
                return { userId: user.id }
            else
                return { error: 'Wrong password, keep trying (if it really is your account)'}
        } else
            return { error: 'We can\'t find any user with this email'}
    })
}