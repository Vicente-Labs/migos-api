import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { preRegisters } from '@/db/schemas'
import { BadRequestError } from '@/http/_errors/bad-request-errors'

export async function preRegisterRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/pre-register',
    {
      schema: {
        tags: ['auth'],
        summary: 'Pre-register with email',
        body: z.object({
          email: z.string().email(),
          language: z.enum(['en-US', 'pt-BR', 'es-ES']),
        }),
        response: {
          201: z.object({
            message: z.literal('User pre-registered successfully'),
          }),
          400: z.object({
            message: z.literal('User already exists'),
          }),
          500: z.object({
            message: z.literal('Internal server error'),
          }),
        },
      },
    },
    async (req, res) => {
      const { email, language } = req.body

      const existingUser = await db
        .select()
        .from(preRegisters)
        .where(eq(preRegisters.email, email.toLowerCase()))

      if (existingUser && existingUser.length > 0)
        throw new BadRequestError('User already exists')

      await db.insert(preRegisters).values({
        email: email.toLowerCase(),
        language,
      })

      return res.status(200).send({
        message: 'User pre-registered successfully',
      })
    },
  )
}
