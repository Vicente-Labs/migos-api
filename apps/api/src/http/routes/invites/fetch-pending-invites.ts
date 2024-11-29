import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { invites, users } from '@/db/schemas'
import { BadRequestError } from '@/http/_errors/bad-request-errors'
import { auth } from '@/http/middlewares/auth'

const inviteSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
  inviterId: z.string(),
  groupId: z.string(),
})

export async function getPendingInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/pending-invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Fetch pending invites',
          response: {
            200: z.object({
              message: z.literal('Pending invites fetched successfully'),
              invites: inviteSchema.array(),
            }),
            400: z.object({
              message: z.literal('User not found'),
            }),
            401: z.object({
              message: z.enum(['Missing auth token', 'Invalid token']),
            }),
            500: z.object({
              message: z.literal('Internal server error'),
            }),
          },
        },
      },
      async (req, res) => {
        const { sub: userId } = await req.getCurrentUserId()

        const [user] = await db.select().from(users).where(eq(users.id, userId))

        if (!user) throw new BadRequestError(`User not found`)

        const pendingInvites = await db
          .select()
          .from(invites)
          .where(
            and(eq(invites.status, 'PENDING'), eq(invites.email, user.email)),
          )

        return res.status(200).send({
          message: 'Pending invites fetched successfully',
          invites: pendingInvites,
        })
      },
    )
}
