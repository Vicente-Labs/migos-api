import { groupSchema } from '@migos/auth'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { member } from '@/db/schemas'
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
            groupId: z.string().uuid(),
          }),
          response: {
            204: z.object({
              message: z.literal('matches generated successfully'),
            }),
            400: z.object({
              message: z.tuple([
                z.literal('group must have at least 2 members'),
                z.literal('number of members must be a even number'),
              ]),
            }),
            401: z.object({
              message: z.tuple([
                z.literal('you are not able to perform this action'),
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

        const authGroup = groupSchema.parse({
          ...group,
          isMember: true,
          role: membership,
          isOwner: group.ownerId === userId,
        })

        if (cannot('sort', authGroup))
          throw new UnauthorizedError('you are not able to perform this action')

        const members = await db
          .select()
          .from(member)
          .where(eq(member.groupId, groupId))

        if (members.length < 2)
          throw new BadRequestError('group must have at least 2 members')

        if (members.length % 2 !== 0)
          throw new BadRequestError('number of members must be a even number')

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

        return res.status(200).send({
          message: 'matches generated successfully',
        })
      },
    )
}
