import { groupSchema } from '@migos/auth/src/models/group'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '@/db'
import { groups } from '@/db/schemas'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteGroup(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .delete(
      '/groups/:groupId',
      {
        schema: {
          tags: ['group'],
          params: z.object({
            groupId: z.string(),
          }),
        },
      },
      async (req, res) => {
        const { groupId } = req.params

        const { sub: userId } = await req.getCurrentUserId()
        const { group, membership } = await req.getUserMembership(groupId)

        const { cannot } = getUserPermissions(userId, membership)

        const isGroupOwner = group.ownerId === userId

        const authGroup = groupSchema.parse({
          ...group,
          isOwner: isGroupOwner,
        })

        if (cannot('delete', authGroup))
          throw new UnauthorizedError(
            'You are not allowed to delete this group',
          )

        await db.delete(groups).where(eq(groups.id, groupId))

        return res.status(204).send()
      },
    )
}
