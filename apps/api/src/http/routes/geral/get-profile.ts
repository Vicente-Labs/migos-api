import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { users } from '@/db/schemas'
import { NotFoundError } from '@/http/_errors/not-found-error'

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
})

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/users/:userId',
    {
      schema: {
        tags: ['geral'],
        params: z.object({ userId: z.string() }),
        description: 'Get user profile',
        response: {
          200: z.object({
            user: userSchema,
          }),
          404: z.object({
            message: z.literal('user not found'),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { userId } = req.params

      const user = await db.select().from(users).where(eq(users.id, userId))

      if (!user || user.length <= 0) throw new NotFoundError('user not found')

      const formattedUser = userSchema.parse(user[0])

      return res.status(200).send({
        user: formattedUser,
      })
    },
  )
}
