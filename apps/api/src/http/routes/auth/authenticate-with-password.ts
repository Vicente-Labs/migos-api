import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import * as jose from 'jose'
import { z } from 'zod'

import { db } from '@/db'
import { users } from '@/db/schemas'
import { env } from '@/env'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/authenticate/password',
    {
      schema: {
        tags: ['auth'],
        description: 'Authenticate with password',
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          401: z.object({
            message: z.literal('Invalid credentials'),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { email, password } = req.body

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLocaleLowerCase()))

      if (!user || !user.passwordHash) {
        return res.status(401).send({ message: 'Invalid credentials' })
      }

      const passwordIsValid = await compare(password, user.passwordHash)

      if (!passwordIsValid) {
        return res.status(401).send({ message: 'Invalid credentials' })
      }

      const secret = new TextEncoder().encode(env.JWT_SECRET)

      const token = await new jose.SignJWT({ sub: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .setIssuedAt()
        .sign(secret)

      return res.status(200).send({ token })
    },
  )
}
