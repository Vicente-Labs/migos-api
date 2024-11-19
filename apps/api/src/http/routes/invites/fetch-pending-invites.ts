import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { db } from '@/db'
import { invites, users } from '@/db/schemas'
import { BadRequestError } from '@/http/_errors/bad-request-errors'
import { auth } from '@/http/middlewares/auth'

export async function getPendingInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/pending-invites',
      {
        schema: {
          tags: ['invite'],
        },
      },
      async (req, res) => {
        const { sub: userId } = await req.getCurrentUserId()

        const [user] = await db.select().from(users).where(eq(users.id, userId))

        if (!user) throw new BadRequestError(`user not found`)

        const pendingInvites = await db
          .select()
          .from(invites)
          .where(
            and(eq(invites.status, 'PENDING'), eq(invites.email, user.email)),
          )

        return res.status(200).send({ invites: pendingInvites })
      },
    )
}
