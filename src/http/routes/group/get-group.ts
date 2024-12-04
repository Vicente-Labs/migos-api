import { groupSchema as authGroupSchema } from '@/auth'
import { count, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { member } from '@/db/schemas'
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
  endDate: z.coerce.date(),
  drawDate: z.coerce.date().nullable().optional(),
  membersCount: z.number(),
  timesMatchesGenerated: z.number(),
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
              message: z.literal('Group fetched successfully'),
              group: groupSchema,
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
                'Missing auth token',
                'Invalid token',
                `You're not a member of this group`,
              ]),
            }),
            500: z.object({
              message: z.literal('Internal server error'),
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
          ownerPlan: 'BASIC', // forcing BASIC plan cuz its irrelevant in this context, and we don't wanna to spend bandwidth with irrelevant db queries
        })

        if (cannot('get', authGroup))
          throw new UnauthorizedError(
            'You are not allowed to access this group',
          )

        const membersCount = await db
          .select({ count: count() })
          .from(member)
          .where(eq(member.groupId, groupId))

        const formattedGroup = {
          id: group.id,
          ownerId: group.ownerId,
          avatarUrl: group.avatarUrl,
          name: group.name,
          description: group.description,
          budget: group.budget,
          updatedAt: group.updatedAt,
          createdAt: group.createdAt,
          endDate: group.endDate,
          drawDate: group.drawDate,
          timesMatchesGenerated: group.timesMatchesGenerated,
          membersCount: membersCount[0].count,
        }

        return res.status(200).send({
          message: 'Group fetched successfully',
          group: formattedGroup,
        })
      },
    )
}
