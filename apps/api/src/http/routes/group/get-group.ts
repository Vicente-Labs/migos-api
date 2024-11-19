import { groupSchema } from '@migos/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getGroup(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .get(
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
        const { sub: userId } = await req.getCurrentUserId()
        const { groupId } = req.params

        const { group, membership } = await req.getUserMembership(groupId)

        const { cannot } = getUserPermissions(userId, membership)

        const authGroup = groupSchema.parse({
          ...group,
          isMember: true,
          isOwner: group.ownerId === userId,
          role: membership,
        })

        if (cannot('get', authGroup))
          throw new UnauthorizedError(
            'you are not allowed to access this group',
          )

        return res.status(200).send({ group })
      },
    )
}
