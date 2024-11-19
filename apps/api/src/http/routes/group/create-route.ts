import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '@/db'
import { groups } from '@/db/schemas'
import { auth } from '@/http/middlewares/auth'

export async function createGroup(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/groups',
      {
        schema: {
          tags: ['group'],
          body: z.object({
            name: z.string(),
            description: z.string().optional(),
            budget: z.coerce.number(),
            avatarUrl: z.string().optional(),
          }),
        },
      },
      async (req, res) => {
        const { sub: userId } = await req.getCurrentUserId()

        const { name, description, budget, avatarUrl } = req.body

        const [group] = await db
          .insert(groups)
          .values({
            name,
            description,
            budget: budget.toString(), // Its decimal in the database, but it needs to be a string to be inserted
            avatarUrl,
            ownerId: userId,
          })
          .returning({ id: groups.id })

        if (!group)
          throw new Error('An error occurred while creating the group')

        return res.status(201).send({ groupId: group.id })
      },
    )
}
