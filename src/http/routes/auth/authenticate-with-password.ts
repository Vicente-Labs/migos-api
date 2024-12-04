import * as bcryptjs from 'bcryptjs'
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
          password: z
            .string()
            .min(8, 'Password must be at least 8 characters long'),
        }),
        response: {
          200: z.object({
            message: z.literal('Authenticated successfully'),
            token: z.string(),
          }),
          401: z.object({
            message: z.enum(['Invalid credentials', 'Validation error']),
            errors: z
              .object({
                password: z
                  .array(
                    z.literal('Password must be at least 8 characters long'),
                  )
                  .optional(),
                email: z.array(z.literal('Invalid email')).optional(),
              })
              .optional(),
          }),
          500: z.object({
            message: z.literal('Internal server error'),
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

      const passwordIsValid = await bcryptjs.compare(password, user.passwordHash)

      if (!passwordIsValid) {
        return res.status(401).send({ message: 'Invalid credentials' })
      }

      const secret = new TextEncoder().encode(env.JWT_SECRET)

      const token = await new jose.SignJWT({ sub: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .setIssuedAt()
        .sign(secret)

      return res.status(200).send({
        message: 'Authenticated successfully',
        token,
      })
    },
  )
}
