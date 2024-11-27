import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { invites } from '@/db/schemas'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const inviteSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
  inviterId: z.string(),
  groupId: z.string(),
})

export async function fetchInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/groups/:groupId/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Fetch group invites',
          params: z.object({
            groupId: z.string(),
          }),
          response: {
            200: z.object({
              message: z.literal('invites fetched successfully'),
              invites: inviteSchema.array(),
            }),
            400: z.object({
              message: z.literal(`you're not allowed to get group invites`),
            }),
            401: z.object({
              message: z.tuple([
                z.literal('missing auth token.'),
                z.literal('invalid auth token.'),
              ]),
            }),
          },
        },
      },
      async (req, res) => {
        const { groupId } = req.params
        const { sub: userId } = await req.getCurrentUserId()
        const { membership } = await req.getUserMembership(groupId)

        const { cannot } = getUserPermissions(userId, membership)

        if (cannot('get', 'invite'))
          throw new UnauthorizedError(`You're not allowed to get group invites`)

        const queriedInvites = await db
          .select()
          .from(invites)
          .where(eq(invites.groupId, groupId))

        return res.status(200).send({
          message: 'invites fetched successfully',
          invites: queriedInvites,
        })
      },
    )
}
