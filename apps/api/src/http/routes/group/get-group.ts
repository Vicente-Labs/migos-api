import { groupSchema as authGroupSchema } from '@migos/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const groupSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  avatarUrl: z.string().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  budget: z.string(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
})

export async function getGroup(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/groups/:groupId',
      {
        schema: {
          tags: ['group'],
          summary: 'Get a group',
          params: z.object({
            groupId: z.string(),
          }),
          response: {
            200: z.object({
              message: z.literal('group fetched successfully'),
              group: groupSchema,
            }),
            401: z.object({
              message: z.tuple([
                z.literal('missing auth token'),
                z.literal('invalid auth token'),
              ]),
            }),
            500: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { sub: userId } = await req.getCurrentUserId()
        const { groupId } = req.params

        const { group, membership } = await req.getUserMembership(groupId)

        const { cannot } = getUserPermissions(userId, membership)

        const authGroup = authGroupSchema.parse({
          ...group,
          isMember: true,
          isOwner: group.ownerId === userId,
          role: membership,
        })

        if (cannot('get', authGroup))
          throw new UnauthorizedError(
            'you are not allowed to access this group',
          )

        const formattedGroup = {
          id: group.id,
          ownerId: group.ownerId,
          avatarUrl: group.avatarUrl,
          name: group.name,
          description: group.description,
          budget: group.budget,
          updatedAt: group.updatedAt,
          createdAt: group.createdAt,
        }

        return res.status(200).send({
          message: 'group fetched successfully',
          group: formattedGroup,
        })
      },
    )
}
