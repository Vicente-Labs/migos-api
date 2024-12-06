import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { groups, member, users } from '@/db/schemas'
import { NotFoundError } from '@/http/_errors/not-found-error'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { groupSchema } from '@/auth'

const matchSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable(),
  giftTip: z.string().nullable(),
})

export async function getMyMatch(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/groups/:groupId/my-match',
      {
        schema: {
          tags: ['group'],
          summary: 'Get my match',
          params: z.object({
            groupId: z.string(),
          }),
          response: {
            200: z.object({
              message: z.literal('Match fetched successfully'),
              match: matchSchema,
            }),
            400: z.object({
              message: z.literal('The group has not generated any matches yet'),
            }),
            401: z.object({
              message: z.enum([
                'You are not authorized to view your match',
                'Missing auth token',
                'Invalid token',
                `You're not a member of this group`,
                'Validation error',
              ]),
              errors: z
                .object({
                  groupId: z.array(z.string()).optional(),
                })
                .optional(),
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

        const authGroup = groupSchema.parse({
          id: group.id,
          ownerId: userId,
          ownerPlan: 'BASIC', // irrelevant so we won't spend bandwidth with this db query
          isMember: true,
          role: membership,
          membersCount: 0, // irrelevant to auth package, our route must handle it
          userGroupsCount: 0, // irrelevant so we won't spend bandwidth with this db query
          timesMatchesGenerated: 0, // irrelevant so we won't spend bandwidth with this db query
        })

        if (cannot('get', authGroup))
          throw new UnauthorizedError(
            'You are not authorized to view your match',
          )

        const match = await db
          .select({
            userId: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
          })
          .from(member)
          .leftJoin(users, eq(users.id, member.matchId))
          .leftJoin(groups, eq(groups.id, member.groupId))
          .where(and(eq(member.groupId, groupId), eq(member.userId, userId)))

        if (
          !match ||
          match.length <= 0 ||
          !match[0].userId ||
          !match[0].name ||
          !match[0].email ||
          !match[0].avatarUrl
        )
          throw new NotFoundError('The group has not generated any matches yet')

        const matchMember = await db
          .select()
          .from(member)
          .where(
            and(
              eq(member.groupId, groupId),
              eq(member.userId, match[0].userId),
            ),
          )

        if (!matchMember || matchMember.length <= 0)
          throw new NotFoundError('the group has not generated any matches yet')

        const completeMatch = matchSchema.parse({
          userId: match[0].userId,
          name: match[0].name,
          email: match[0].email,
          avatarUrl: match[0].avatarUrl,
          giftTip: matchMember[0].giftTip,
        })

        return res.status(200).send({
          message: 'Match fetched successfully',
          match: completeMatch,
        })
      },
    )
}
