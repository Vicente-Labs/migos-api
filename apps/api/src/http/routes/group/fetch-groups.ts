import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { groups, member } from '@/db/schemas'
import { auth } from '@/http/middlewares/auth'

export async function fetchGroups(app: FastifyInstance) {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/groups',
      {
        schema: {
          tags: ['group'],
          querystring: z.object({ page: z.coerce.number() }),
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

        const formattedGroups = fetchedGroups.map(({ group, member }) => {
          if (!group) return null

          return {
            ...group,
            isMember: true,
            isOwner: group.ownerId === userId,
            role: member.role,
          }
        })

        return res.status(200).send({ groups: formattedGroups })
      },
    )
}
