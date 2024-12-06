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
          tags: ['invites'],
          summary: 'Accept a group invite',
          params: z.object({
            inviteId: z.string(),
          }),
          response: {
            201: z.object({
              message: z.literal('Invite accepted successfully'),
              groupId: z.string(),
            }),
            400: z.object({
              message: z.enum([
                'Invite not found or expired',
                'This invite belongs to another user',
                'Validation error',
              ]),
              errors: z
                .object({
                  inviteId: z.array(z.string()).optional(),
                })
                .optional(),
            }),
            401: z.object({
              message: z.enum(['Missing auth token', 'Invalid token']),
            }),
            500: z.object({
              message: z.literal('Internal server error'),
            }),
          },
        },
      },
      async (req, res) => {
        try {
          const { sub: userId } = await req.getCurrentUserId()
          const { inviteId } = req.params

          const [{ invite, user }] = await db.transaction(async (tx) => {
            const [invite] = await tx
              .select()
              .from(invites)
              .where(eq(invites.id, inviteId))

            if (!invite) {
              throw new BadRequestError('Invite not found or expired')
            }

            const [user] = await tx
              .select()
              .from(users)
              .where(eq(users.id, userId))

            if (!user) throw new BadRequestError('User not found')

            return [{ invite, user }]
          })

          if (invite.email !== user.email)
            throw new BadRequestError('This invite belongs to another user')

          await db.transaction(async (tx) => {
            await tx.insert(member).values({
              userId,
              groupId: invite.groupId,
            })

            await tx.delete(invites).where(eq(invites.id, inviteId))
          })

          return res.status(201).send({
            message: 'Invite accepted successfully',
            groupId: invite.groupId,
          })
        } catch (error) {
          if (error instanceof BadRequestError) {
            throw error
          }
          throw new Error('Failed to accept invite')
        }
      },
    )
}
