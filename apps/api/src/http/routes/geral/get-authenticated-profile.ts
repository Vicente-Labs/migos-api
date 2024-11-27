import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { users } from '@/db/schemas'
import { NotFoundError } from '@/http/_errors/not-found-error'
import { auth } from '@/http/middlewares/auth'

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
})

export async function getAuthenticatedProfile(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/me',
      {
        schema: {
          tags: ['geral'],
          description: 'Get the profile of the authenticated user',
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
        const { sub: userId } = await req.getCurrentUserId()

        const user = await db.select().from(users).where(eq(users.id, userId))

        if (!user || user.length <= 0) throw new NotFoundError('user not found')

        const formattedUser = userSchema.parse(user[0])

        return res.status(200).send({
          user: formattedUser,
        })
      },
    )
}
