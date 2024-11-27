import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { invites, member, users } from '@/db/schemas'
import { BadRequestError } from '@/http/_errors/bad-request-errors'
import { auth } from '@/http/middlewares/auth'

export async function acceptInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          tags: ['invite'],
          summary: 'Accept a group invite',
          params: z.object({
            inviteId: z.string().uuid(),
          }),
          response: {
            201: z.object({
              message: z.literal('invite accepted successfully'),
              groupId: z.string(),
            }),
            400: z.object({
              message: z.tuple([
                z.literal(`invite not found or expired`),
                z.literal('this invite belongs to another user'),
              ]),
            }),
            401: z.object({
              message: z.tuple([
                z.literal('missing auth token.'),
                z.literal('invalid auth token.'),
              ]),
            }),
          },
        },
      },
      async (req, res) => {
        const { sub: userId } = await req.getCurrentUserId()
        const { inviteId } = req.params

        const [invite] = await db
          .select()
          .from(invites)
          .where(eq(invites.id, inviteId))

        if (!invite) throw new BadRequestError('invite not found or expired')

        const [user] = await db.select().from(users).where(eq(users.id, userId))

        if (!user) throw new BadRequestError(`User not found`)

        if (invite.email !== user.email)
          throw new BadRequestError('this invite belongs to another user')

        await db.transaction(async (tx) => {
          await tx.insert(member).values({
            userId,
            groupId: invite.groupId,
          })

          await tx.delete(invites).where(eq(invites.id, inviteId))
        })

        return res.status(201).send({
          message: 'invite accepted successfully',
          groupId: invite.groupId,
        })
      },
    )
}
