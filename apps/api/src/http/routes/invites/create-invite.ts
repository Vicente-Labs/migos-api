import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { invites } from '@/db/schemas'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createInvite(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/group/:groupId/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Create a group invite',
          params: z.object({
            groupId: z.string().uuid(),
          }),
          body: z.object({
            name: z.string(),
            email: z.string().email(),
          }),
          response: {
            201: z.object({
              message: z.literal('invite created successfully'),
              inviteId: z.string(),
              name: z.string(),
              email: z.string().email(),
            }),
          },
        },
      },
      async (req, res) => {
        const { groupId } = req.params

        const { sub: userId } = await req.getCurrentUserId()
        const { membership } = await req.getUserMembership(groupId)

        const { cannot } = getUserPermissions(userId, membership)

        if (cannot('create', 'invite'))
          throw new UnauthorizedError(
            'you are not allowed to invite users to this group',
          )

        const { email, name } = req.body

        const [invite] = await db
          .insert(invites)
          .values({
            groupId,
            email: email.toLowerCase(),
            inviterId: userId,
          })
          .returning()

        /* NOTE: 
        we're sending this response because the email sending will be done
        in the front-end, because we have multi-language support that is only
        handled in the front end */

        return res.status(201).send({
          message: 'invite created successfully',
          inviteId: invite.id,
          name,
          email: email.toLowerCase(),
        })
      },
    )
}
