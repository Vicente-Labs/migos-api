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

export async function transferGroupOwnership(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .patch(
      '/groups/:groupId/owner',
      {
        schema: {
          tags: ['group'],
          summary: 'Transfer group ownership',
          params: z.object({
            groupId: z.string(),
          }),
          response: {
            200: z.object({
              message: z.literal('Group ownership transferred successfully'),
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
                'You are not allowed to transfer ownership',
                "You're not a member of this group",
                'Group name is required',
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

        const { cannot } = getUserPermissions(userId, membership)

        const authGroup = groupSchema.parse({
          ...group,
          isOwner: group.ownerId === userId,
        })

        if (cannot('update', authGroup))
          throw new UnauthorizedError(
            'You are not allowed to transfer ownership',
          )

        await db
          .update(groups)
          .set({ ownerId: userId })
          .where(eq(groups.id, groupId))

        return res.status(204).send()
      },
    )
}
