import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { users } from '@/db/schemas'
import { BadRequestError } from '@/http/_errors/bad-request-errors'

export async function registerAccountWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        description: 'Register a new user with password',
        body: z.object({
          email: z.string().email(),
          name: z.string(),
          username: z.string(),
          password: z.string(),
        }),
        response: {
          204: z.null(),
          400: z.object({
            message: z.enum(['User with same email already exists']),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { email, name, password } = req.body

      const userWithSameEmail = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      })

      if (userWithSameEmail) {
        return new BadRequestError('User with same email already exists')
      }

      const passwordHash = await hash(password, 8)

      await db.insert(users).values({
        email: email.toLowerCase(),
        name,
        passwordHash,
      })

      return res.status(204).send()
    },
  )
}
