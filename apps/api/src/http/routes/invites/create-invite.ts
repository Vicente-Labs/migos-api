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
            groupId: z.string(),
          }),
          body: z.object({
            name: z.string(),
            email: z.string().email(),
          }),
          response: {
            201: z.object({
              message: z.literal('Invite created successfully'),
              inviteId: z.string(),
              name: z.string(),
              email: z.string().email(),
            }),
            400: z.object({
              message: z.enum(['Validation error']),
              errors: z
                .object({
                  email: z.array(z.string()).optional(),
                  name: z.array(z.string()).optional(),
                  groupId: z.array(z.string()).optional(),
                })
                .optional(),
            }),
            401: z.object({
              message: z.enum([
                'Missing auth token',
                'Invalid token',
                'You are not allowed to invite users to this group',
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
        const { membership } = await req.getUserMembership(groupId)

        const { cannot } = getUserPermissions(userId, membership)

        if (cannot('create', 'invite'))
          throw new UnauthorizedError(
            'You are not allowed to invite users to this group',
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
          message: 'Invite created successfully',
          inviteId: invite.id,
          name,
          email: email.toLowerCase(),
        })
      },
    )
}
