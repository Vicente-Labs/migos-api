import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { groupSchema } from '@/auth'
import { db } from '@/db'
import { groups } from '@/db/schemas'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateBudget(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .patch(
      '/groups/:groupId/budget',
      {
        schema: {
          tags: ['group'],
          summary: 'Update group budget',
          params: z.object({
            groupId: z.string(),
          }),
          body: z.object({
            budget: z.string(),
            currency: z.enum(['USD', 'EUR', 'BRL']),
          }),
          response: {
            200: z.object({
              message: z.literal('Group budget updated successfully'),
            }),
            400: z.object({
              message: z.string(),
              errors: z
                .object({
                  description: z.array(z.string()).optional(),
                  groupId: z.array(z.string()).optional(),
                })
                .optional(),
            }),
            401: z.object({
              message: z.enum([
                'You are not allowed to update this group budget',
                "You're not a member of this group",
                'Missing auth token',
                'Invalid token',
              ]),
            }),
            500: z.object({
              message: z.literal('Internal server error'),
            }),
          },
        },
      },
      async (req, res) => {
        const { groupId } = req.params

        const { sub: userId } = await req.getCurrentUserId()
        const { group, membership } = await req.getUserMembership(groupId)

        const { budget, currency } = req.body

        const { cannot } = getUserPermissions(userId, membership)

        const authGroup = groupSchema.parse({
          id: group.id,
          ownerId: userId,
          isMember: true,
          role: membership,
          membersCount: 0, // irrelevant so we won't spend bandwidth with this db query
          userGroupsCount: 0, // irrelevant so we won't spend bandwidth with this db query
          timesMatchesGenerated: 0, // irrelevant so we won't spend bandwidth with this db query
        })

        if (cannot('update', authGroup))
          throw new UnauthorizedError(
            'You are not allowed to update this group budget',
          )

        await db
          .update(groups)
          .set({ budget, currency })
          .where(eq(groups.id, groupId))

        return res.status(200).send({
          message: 'Group budget updated successfully',
        })
      },
    )
}
