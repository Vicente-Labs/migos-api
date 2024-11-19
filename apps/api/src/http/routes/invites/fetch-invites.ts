import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { invites } from '@/db/schemas'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function fetchInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/groups/:groupId/invites',
      {
        schema: {
          tags: ['invite'],
          params: z.object({
            groupId: z.string(),
          }),
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

        return res.status(200).send({ invites: queriedInvites })
      },
    )
}
