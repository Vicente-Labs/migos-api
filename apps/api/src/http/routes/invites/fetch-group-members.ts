import { planSchema } from '@migos/auth'
import { eq, sql } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/db'
import { member, users } from '@/db/schemas'
import { auth } from '@/http/middlewares/auth'

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().nullable(),
  isAdmin: z.boolean(),
  isOwner: z.boolean(),
  plan: planSchema,
})

export async function fetchGroupMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/groups/:groupId/members',
      {
        schema: {
          tags: ['groups'],
          summary: 'Fetch group members',
          params: z.object({
            groupId: z.string(),
          }),
          response: {
            200: z.object({
              message: z.literal('Group members fetched successfully'),
              members: z.array(userSchema),
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
        await req.getCurrentUserId()

        const { groupId } = req.params

        const { group } = await req.getUserMembership(groupId)

        const queriedMembers = await db
          .select({
            id: member.userId,
            role: member.role,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
            isAdmin: sql<boolean>`${member.role} = 'ADMIN'`,
            isOwner: sql<boolean>`${group.ownerId} = ${member.userId}`,
            plan: users.plan,
          })
          .from(member)
          .where(eq(member.groupId, groupId))
          .leftJoin(users, eq(member.userId, users.id))

        const formattedMembers = queriedMembers
          .map((member) => {
            if (!member.id || !member.name || !member.email || !member.role)
              return null

            return {
              id: member.id,
              name: member.name,
              email: member.email,
              avatarUrl: member.avatarUrl,
              isAdmin: member.role === 'ADMIN',
              isOwner: group.ownerId === member.id,
              plan: member.plan ?? 'BASIC',
            }
          })
          .filter((member) => member !== null)

        return res.status(200).send({
          message: 'Group members fetched successfully',
          members: formattedMembers,
        })
      },
    )
}
