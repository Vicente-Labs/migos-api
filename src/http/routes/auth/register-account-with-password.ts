import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { users } from '@/db/schemas'
import { ConflictError } from '@/http/_errors/conflict-error'

export async function registerAccountWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        description: 'Register a new user with password',
        body: z.object({
          email: z.string().min(1, 'Email is required').email(),
          name: z.string().min(1, 'Name is required'),
          password: z
            .string()
            .min(8, 'Password must be at least 8 characters long'),
        }),
        response: {
          201: z.object({
            message: z.literal('User created successfully'),
          }),
          400: z.object({
            message: z.enum([
              'Validation error',
              'User with same email already exists',
            ]),
            errors: z
              .object({
                email: z.array(z.literal('Invalid email')).optional(),
                name: z.array(z.literal('Name is required')).optional(),
                password: z
                  .array(
                    z.literal('Password must be at least 8 characters long'),
                  )
                  .optional(),
              })
              .optional(),
          }),
          409: z.object({
            message: z.literal('User with same email already exists'),
          }),
          500: z.object({
            message: z.literal('Internal server error'),
          }),
        },
      },
    },
    async (req, res) => {
      const { email, name, password } = req.body

      const userWithSameEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()))

      if (userWithSameEmail && userWithSameEmail.length > 0)
        throw new ConflictError('User with same email already exists')

      const passwordHash = await hash(password, 8)

      await db.insert(users).values({
        email: email.toLowerCase(),
        name,
        passwordHash,
      })

      return res.status(201).send({
        message: 'User created successfully',
      })
    },
  )
}
