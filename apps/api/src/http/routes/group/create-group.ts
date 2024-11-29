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
            endDate: z
              .string()
              .datetime()
              .transform((dt) => new Date(dt)),
            drawDate: z
              .string()
              .datetime()
              .transform((dt) => new Date(dt)),
          }),
          response: {
            201: z.object({
              message: z.literal('Group created successfully'),
              id: z.string(),
            }),
            400: z.object({
              message: z.string(),
              errors: z
                .object({
                  name: z.array(z.string()).optional(),
                  description: z.array(z.string()).optional(),
                  budget: z.array(z.string()).optional(),
                  avatarUrl: z.array(z.string()).optional(),
                  endDate: z.array(z.string()).optional(),
                  drawDate: z.array(z.string()).optional(),
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
          .groupBy(users.id)

        if (!user || user.length <= 0)
          throw new BadRequestError('User not found')

        const randomCUID = createId()

        const authGroup = groupSchema.parse({
          id: randomCUID,
          ownerId: userId,
          ownerPlan: user[0].plan,
          isMember: true,
          role: 'MEMBER', // irrelevant so we won't spend bandwidth with this db query
          membersCount: 0,
          userGroupsCount: user[0].groupsCount,
          timesMatchesGenerated: 0,
        })

        const { cannot } = getUserPermissions(userId, 'MEMBER')

        if (cannot('create', authGroup))
          throw new BadRequestError(
            `You cannot create more than ${user[0].groupsCount} groups`,
          )

        const { name, description, budget, avatarUrl, endDate, drawDate } =
          req.body

        const { groupId } = await db.transaction(async (tx) => {
          const group = await tx
            .insert(groups)
            .values({
              name,
              description,
              budget: budget.toString(),
              avatarUrl,
              ownerId: userId,
              endDate,
              drawDate,
            })
            .returning({
              id: groups.id,
            })

          if (!group || group.length <= 0) throw new Error()

          await tx.insert(member).values({
            userId,
            groupId: group[0].id,
            role: 'ADMIN',
          })

          return { groupId: group[0].id }
        })

        return res.status(201).send({
          message: 'Group created successfully',
          id: groupId,
        })
      },
    )
}
