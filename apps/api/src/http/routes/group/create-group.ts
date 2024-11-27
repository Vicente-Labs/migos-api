import { createId } from '@paralleldrive/cuid2'
import { count, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '@/db'
import { groups, member, users } from '@/db/schemas'
import { BadRequestError } from '@/http/_errors/bad-request-errors'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { groupSchema } from '~/packages/auth/src'

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
            endDate: z.coerce.date(),
            drawDate: z.coerce.date().nullable(),
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

        const user = await db
          .select({
            id: users.id,
            plan: users.plan,
            groupsCount: count(member.groupId),
          })
          .from(users)
          .where(eq(users.id, userId))
          .leftJoin(member, eq(users.id, member.userId))

        if (!user || user.length <= 0)
          throw new BadRequestError('user not found')

        const groupId = createId()

        const authGroup = groupSchema.parse({
          ownerId: userId,
          ownerPlan: user[0].plan,
          groups: user[0].groupsCount,
          isMember: true,
          id: groupId,
        })

        const { cannot } = getUserPermissions(userId, 'MEMBER')

        if (cannot('create', authGroup))
          throw new BadRequestError(
            `you cannot create more than ${user[0].groupsCount} groups`,
          )

        const { name, description, budget, avatarUrl, endDate, drawDate } =
          req.body

        await db
          .insert(groups)
          .values({
            id: groupId,
            name,
            description,
            budget: budget.toString(), // Its decimal in the database, so it needs to be a string to be inserted
            avatarUrl,
            ownerId: userId,
            endDate,
            drawDate,
          })
          .returning({ id: groups.id })

        return res.status(201).send({
          message: 'group created successfully',
        })
      },
    )
}
