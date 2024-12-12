import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { groupSchema as authGroupSchema } from '@/auth'
import { db } from '@/db'
import { member, users } from '@/db/schemas'
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
  currency: z.enum(['USD', 'EUR', 'BRL']),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  endDate: z.coerce.date(),
  drawDate: z.coerce.date().nullable().optional(),
  membersCount: z.number(),
  members: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      avatarUrl: z.string().nullable().optional(),
    })
    .array(),

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
        })

        if (cannot('get', authGroup))
          throw new UnauthorizedError(
            'You are not allowed to access this group',
          )

        const members = await db
          .select({
            id: member.userId,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
            giftTip: member.giftTip,
          })
          .from(member)
          .where(eq(member.groupId, groupId))
          .leftJoin(users, eq(member.userId, users.id))

        const formattedMembers = members
          .map((member) => {
            if (!member.id || !member.name || !member.email) return null

            return {
              id: member.id,
              name: member.name,
              email: member.email,
              avatarUrl: member.avatarUrl,
              giftTip: member.giftTip,
            }
          })
          .filter((member) => member !== null)

        const formattedGroup = {
          id: group.id,
          ownerId: group.ownerId,
          avatarUrl: group.avatarUrl,
          name: group.name,
          description: group.description,
          budget: group.budget,
          currency: group.currency,
          updatedAt: group.updatedAt,
          createdAt: group.createdAt,
          endDate: group.endDate,
          drawDate: group.drawDate,
          timesMatchesGenerated: group.timesMatchesGenerated,
          members: formattedMembers,
          membersCount: formattedMembers.length,
        }

        return res.status(200).send({
          message: 'Group fetched successfully',
          group: formattedGroup,
        })
      },
    )
}
