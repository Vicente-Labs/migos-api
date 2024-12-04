import { roleSchema } from '@/auth'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { groups, member } from '@/db/schemas'
import { auth } from '@/http/middlewares/auth'

const groupSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  role: roleSchema,
  name: z.string(),
  description: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  budget: z.string(),
  isMember: z.boolean(),
  isOwner: z.boolean(),
  endDate: z.coerce.date().nullable().optional(),
  drawDate: z.coerce.date().nullable().optional(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
})

export async function fetchGroups(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/groups',
      {
        schema: {
          tags: ['group'],
          summary: 'Fetch groups',
          querystring: z.object({ page: z.coerce.number().default(1) }),
          response: {
            200: z.object({
              message: z.literal('Groups fetched successfully'),
              groups: groupSchema.array(),
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

        const { page } = req.query

        const fetchedGroups = await db
          .select({
            group: groups,
            member,
          })
          .from(member)
          .where(eq(member.userId, userId))
          .leftJoin(groups, eq(groups.id, member.groupId))
          .offset((page - 1) * 10)
          .limit(10)

        const formattedGroups = fetchedGroups
          .map(({ group, member }) => {
            if (!group) return null

            return {
              ...group,
              isMember: true,
              isOwner: group.ownerId === userId,
              role: member.role,
            }
          })
          .filter((group): group is NonNullable<typeof group> => group !== null)

        return res.status(200).send({
          message: 'Groups fetched successfully',
          groups: formattedGroups,
        })
      },
    )
}
