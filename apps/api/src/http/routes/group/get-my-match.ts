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
import { groupSchema } from '~/packages/auth/src'

export async function getMyMatch(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/groups/:groupId/my-match',
      {
        schema: {
          tags: ['group'],
          params: z.object({
            groupId: z.string().uuid(),
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
          role: membership,
          isMember: true,
          isOwner: group.ownerId === userId,
        })

        if (cannot('get', authGroup))
          throw new UnauthorizedError(
            'You are not authorized to view your match.',
          )

        const [match] = await db
          .select({
            userId: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
          })
          .from(member)
          .where(and(eq(groups.id, groupId), eq(member.userId, userId)))
          .leftJoin(users, eq(users.id, member.matchId))

        if (
          !match ||
          !match.userId ||
          !match.name ||
          !match.email ||
          !match.avatarUrl
        )
          throw new NotFoundError('the group has not generated any matches yet')

        const [matchMember] = await db
          .select()
          .from(member)
          .where(and(eq(groups.id, groupId), eq(member.userId, match.userId)))

        const completeMatch = {
          ...match,
          giftTip: matchMember?.giftTip || null,
        }

        return res.status(200).send({ match: completeMatch })
      },
    )
}
