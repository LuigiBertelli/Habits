import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { string, z } from 'zod'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'

import { generatePasswordAlias } from '../utils/generate-passwords-alias'

interface UserProps {
    email: string,
    name: string,
    password?: string
}

const createUser = async({ email, name, password = ''} : UserProps) => {
        const created_at = dayjs().toDate()
        const data = {
            email,
            name,
            created_at,
            password: ''
        }

        if(password)
            data.password = await bcrypt.hash(generatePasswordAlias(email, created_at.toString(), password), await bcrypt.genSalt(8));

        return await prisma.users.create({
            data
        })
}

export async function appUsersRoutes(app: FastifyInstance) {

    app.post('/signup', async(req, res) => {
        const signupParams = z.object({
            email: z.string().email(),
            password: z.string(),
            name: z.string().trim()
        })
        
        const user = await createUser(signupParams.parse(req.body))

        return res.status(201).send({userId: user.id})
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
            if(user.password) {
                const pswdIsEqual = await bcrypt.compare(generatePasswordAlias(email, user.created_at.toString(), password), user.password);

                if(pswdIsEqual)
                    return { userId: user.id }
                else
                    return { error: 'Wrong password, keep trying (if it really is your account)'}
            } else 
                return { error: 'Invalid user!'}
        } else
            return { error: 'We can\'t find any user with this email'}
    })

    app.get('/login/:social', async(req) => {

        const loginWithSocialParams = z.object({
            social: z.string(),
        })

        const loginWithSocialQueryParams = z.object({
            id: z.string()
        })

        const { social } = loginWithSocialParams.parse(req.params)
        const { id } = loginWithSocialQueryParams.parse(req.query)

        const externalUser = await prisma.externalUsers.findUnique({
            where: {
                id_social: {id, social}
            }
        })

        return { userId: externalUser?.user_id }
    })

    app.post('/signup/:social', async (req, res) => {
        const signupWithSocialParams = z.object({
            social: z.string()
        })

        const signupWithSocialBody = z.object({
            id: z.string(),
            email: z.string().email(),
            name: z.string().trim(),
        })

        const { social } = signupWithSocialParams.parse(req.params)
        const { id, email, name } = signupWithSocialBody.parse(req.body)

        
        let user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })

        if(!user)
            user = await createUser({email, name})

        await prisma.externalUsers.create({
            data: {
                id,
                users: {
                    connect: {
                        id: user.id
                    }
                },
                social
            }
        })

        return res.status(201).send({userId: user.id})
    })

    app.post('/forgot-password', async (req) => {
        const resetPasswordBody = z.object({
            email: z.string().email()
        })

        const { email } = resetPasswordBody.parse(req.body)

        const user = await prisma.users.findUnique({
            where: { email }
        })

        if(user) {
            let hash = await bcrypt.hash(dayjs(user.created_at).unix().toString(), 8)
            hash = hash.replace('.', '')

            await prisma.users.update({
                where: {
                    id: user.id
                },
                data: {
                    recovery_password_hash: hash
                }
            })

            let transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "bbb9ea1a81b5f0",
                  pass: "07e613ca843954"
                }
            });
    
            const mailOptions = {
                from: 'luigi.bertelli479@gmail.com',
                to: email,
                subject: 'Habits - Reset Password',
                html: `Click <a href="http://localhost:5173/recovery-password/${user.id}/${encodeURIComponent(hash).replace('.', '')}" >here</a> to reset your password.`
            }
    
            transport.sendMail(mailOptions, (error, res) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + res.response);
                }
            })
        }
    })

    app.patch('/recovery-password', async (req) => {
        const recoveryPasswordBody = z.object({
            userId: z.string().uuid(),
            hash: z.string(),
            newPassword: z.string()
        })

        const { userId, hash, newPassword } = recoveryPasswordBody.parse(req.body)

        const user = await prisma.users.findFirst({
            where: {
                id: userId,
                recovery_password_hash: {
                    not: ''
                }
            }
        })

        if(user && user.recovery_password_hash == hash){
            const encryptedPassword = await bcrypt.hash(generatePasswordAlias(user.email, user.created_at.toString(), newPassword), await bcrypt.genSalt(8))
            await prisma.users.update({
                where: {
                    id: userId
                },
                data: {
                    password: encryptedPassword,
                    recovery_password_hash: ''
                }
            })
        } else 
            return { error: 'Error we cannot recovery the password!'}
    })
}