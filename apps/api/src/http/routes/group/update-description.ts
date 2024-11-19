import { groupSchema } from '@migos/auth'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { groups } from '@/db/schemas'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateDescription(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .patch(
      '/groups/:groupId/description',
      {
        schema: {
          tags: ['group'],
          params: z.object({
            groupId: z.string(),
          }),
          body: z.object({
            description: z.string(),
          }),
        },
      },
      async (req, res) => {
        const { groupId } = req.params

        const { sub: userId } = await req.getCurrentUserId()
        const { group, membership } = await req.getUserMembership(groupId)

        const { description } = req.body

        const { cannot } = getUserPermissions(userId, membership)

        const authGroup = groupSchema.parse({
          ...group,
          isOwner: group.ownerId === userId,
        })

        if (cannot('update', authGroup))
          throw new UnauthorizedError(
            'you are not allowed to update this group description',
          )

        await db
          .update(groups)
          .set({ description })
          .where(eq(groups.id, groupId))

        return res.status(204).send()
      },
    )
}
