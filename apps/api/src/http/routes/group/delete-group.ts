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
          summary: 'Delete a group',
          params: z.object({
            groupId: z.string(),
          }),
          response: {
            200: z.object({
              message: z.literal('Group deleted successfully'),
            }),
            400: z.object({
              message: z.string(),
              errors: z
                .object({
                  groupId: z.array(z.string()).optional(),
                })
                .optional(),
            }),
            401: z.object({
              message: z.enum([
                'You are not allowed to delete this group',
                'Missing auth token',
                'Invalid token',
                "You're not a member of this group",
              ]),
            }),
            500: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { groupId } = req.params

        const { sub: userId } = await req.getCurrentUserId()
        const { group, membership } = await req.getUserMembership(groupId)

        const { cannot } = getUserPermissions(userId, membership)

        const authGroup = groupSchema.parse({
          id: group.id,
          ownerId: group.ownerId,
          ownerPlan: 'BASIC', // irrelevant so we won't spend bandwidth with this db query
          isMember: true,
          role: membership,
          membersCount: 1, // irrelevant so we won't spend bandwidth with this db query
          userGroupsCount: 1, // irrelevant so we won't spend bandwidth with this db query
          timesMatchesGenerated: 0, // irrelevant so we won't spend bandwidth with this db query
        })

        if (cannot('delete', authGroup))
          throw new UnauthorizedError(
            'You are not allowed to delete this group',
          )

        await db.delete(groups).where(eq(groups.id, groupId))

        return res.status(200).send({
          message: 'Group deleted successfully',
        })
      },
    )
}
