import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { invites } from '@/db/schemas'
import { BadRequestError } from '@/http/_errors/bad-request-errors'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function revokeInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/groups/:groupId/invites/:inviteId/revoke',
      {
        schema: {
          tags: ['invites'],
          summary: 'Revoke invite',
          params: z.object({
            groupId: z.string(),
            inviteId: z.string().uuid(),
          }),
          response: {
            201: z.object({
              message: z.literal('Invite successfully revoked'),
            }),
            400: z.object({
              message: z.enum([
                "You're not allowed to revoke invites",
                'Invite not found or already accepted',
              ]),
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
        const { groupId, inviteId } = req.params
        const { membership } = await req.getUserMembership(groupId)

        const { cannot } = getUserPermissions(userId, membership)

        if (cannot('revoke', 'invite'))
          throw new UnauthorizedError(`You're not allowed to revoke invites`)

        const invite = await db
          .select()
          .from(invites)
          .where(and(eq(invites.id, inviteId), eq(invites.groupId, groupId)))

        if (!invite)
          throw new BadRequestError(`Invite not found or already accepted`)

        await db.delete(invites).where(eq(invites.id, inviteId))

        return res.status(201).send({ message: 'Invite successfully revoked' })
      },
    )
}
