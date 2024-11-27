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
          summary: 'Create a group',
          body: z.object({
            name: z.string(),
            description: z.string().optional(),
            budget: z.coerce.number(),
            avatarUrl: z.string().optional(),
          }),
          response: {
            201: z.object({
              message: z.literal('group created successfully'),
            }),
            401: z.object({
              message: z.tuple([
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

        const { name, description, budget, avatarUrl } = req.body

        await db
          .insert(groups)
          .values({
            name,
            description,
            budget: budget.toString(), // Its decimal in the database, but it needs to be a string to be inserted
            avatarUrl,
            ownerId: userId,
          })
          .returning({ id: groups.id })

        return res.status(201).send({
          message: 'group created successfully',
        })
      },
    )
}
