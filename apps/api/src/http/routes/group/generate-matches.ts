import { groupSchema } from '@migos/auth'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { member, users } from '@/db/schemas'
import { BadRequestError } from '@/http/_errors/bad-request-errors'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { generateMatchesFn } from '@/utils/generate-matches'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function generateMatches(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .patch(
      '/groups/:groupId/generate-matches',
      {
        schema: {
          tags: ['group'],
          summary: 'Generate matches',
          params: z.object({
            groupId: z.string(),
          }),
          response: {
            201: z.object({
              message: z.literal('Matches generated successfully'),
            }),
            400: z.object({
              message: z.enum([
                'Group must have at least 2 members',
                'Number of members must be a even number',
              ]),
            }),
            401: z.object({
              message: z.enum([
                'You are not able to perform this action',
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

        const owner = await db
          .select()
          .from(users)
          .where(eq(users.id, group.ownerId))

        if (!owner.length) throw new BadRequestError('Owner not found')

        const authGroup = groupSchema.parse({
          id: group.id,
          ownerId: group.ownerId,
          ownerPlan: owner[0].plan,
          isMember: true,
          role: membership,
          membersCount: 0, // irrelevant for auth package so we won't spend bandwidth with this db query
          userGroupsCount: 1, // irrelevant for auth package so we won't spend bandwidth with this db query
          timesMatchesGenerated: group.timesMatchesGenerated,
        })

        if (cannot('sort', authGroup))
          throw new UnauthorizedError('You are not able to perform this action')

        const members = await db
          .select()
          .from(member)
          .where(eq(member.groupId, groupId))

        if (members.length < 2)
          throw new BadRequestError('Group must have at least 2 members')

        if (members.length % 2 !== 0)
          throw new BadRequestError('Number of members must be a even number')

        const { matches } = await generateMatchesFn(members)

        await db.transaction(async (tx) => {
          const updates = matches
            .filter((match) => match.giverId && match.receiverId)
            .map((match) =>
              tx
                .update(member)
                .set({ matchId: match.receiverId })
                .where(eq(member.userId, match.giverId!)),
            )

          await Promise.all(updates)
        })

        return res.status(201).send({
          message: 'Matches generated successfully',
        })
      },
    )
}
