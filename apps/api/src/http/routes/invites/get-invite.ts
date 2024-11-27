import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { invites } from '@/db/schemas'
import { BadRequestError } from '@/http/_errors/bad-request-errors'

const inviteSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
  inviterId: z.string(),
  groupId: z.string(),
})

export async function getInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        tags: ['invites'],
        summary: 'Get invite details',
        params: z.object({
          inviteId: z.string(),
        }),
        response: {
          200: z.object({
            message: z.literal('invite details fetched successfully'),
            invite: inviteSchema,
          }),
          400: z.object({
            message: z.literal(`invite not found`),
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
      const { inviteId } = req.params

      const [invite] = await db
        .select()
        .from(invites)
        .where(eq(invites.id, inviteId))

      if (!invite) throw new BadRequestError(`Invite not found`)

      return res.status(200).send({
        message: 'invite details fetched successfully',
        invite,
      })
    },
  )
}
