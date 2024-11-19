import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { invites } from '@/db/schemas'
import { BadRequestError } from '@/http/_errors/bad-request-errors'

export async function getInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        tags: ['Invite'],
        summary: 'Get invite details',
        params: z.object({
          inviteId: z.string(),
        }),
      },
    },
    async (req, res) => {
      const { inviteId } = req.params

      const [invite] = await db
        .select()
        .from(invites)
        .where(eq(invites.id, inviteId))

      if (!invite) throw new BadRequestError(`Invite not found`)

      return res.status(200).send({ invite })
    },
  )
}
