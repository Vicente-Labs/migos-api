import { and, eq, sql } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import * as jose from 'jose'

import { db } from '@/db'
import { groups, member } from '@/db/schemas'
import { env } from '@/env'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req) => {
    req.getCurrentUserId = async () => {
      if (!req.headers.authorization)
        throw new UnauthorizedError('Missing auth token.')

      const token = req.headers.authorization
        .replace('Bearer ', '')
        .trim()
        .replace(/^,\s*/, '')

      const secretKey = new TextEncoder().encode(env.JWT_SECRET)
      const { payload } = await jose.jwtVerify(token, secretKey, {
        algorithms: ['HS256'],
      })

      if (!payload.sub) throw new UnauthorizedError('Invalid token.')

      return { sub: payload.sub }
    }

    req.getUserMembership = async (id: string) => {
      const { sub: userId } = await req.getCurrentUserId()

      const [queriedMember] = await db
        .select({
          group: {
            id: groups.id,
            name: groups.name,
            description: groups.description,
            budget: groups.budget,
            avatarUrl: groups.avatarUrl,
            updatedAt: groups.updatedAt,
            createdAt: groups.createdAt,
            ownerId: groups.ownerId,
            endDate: groups.endDate,
            drawDate: groups.drawDate,
            isMember: sql<boolean>`${member.userId} = ${userId}`,
          },
          member: { role: member.role },
        })
        .from(member)
        .where(and(eq(member.userId, userId), eq(member.groupId, id)))
        .leftJoin(groups, eq(member.groupId, groups.id))

      if (!queriedMember) {
        throw new UnauthorizedError("You're not a member of this group")
      }

      const group = queriedMember.group
      if (!group || !group.name) {
        throw new UnauthorizedError('Group name is required')
      }

      return {
        group: {
          id: group.id,
          name: group.name,
          budget: group.budget,
          ownerId: group.ownerId,
          description: group.description,
          avatarUrl: group.avatarUrl,
          updatedAt: group.updatedAt,
          createdAt: group.createdAt,
          endDate: group.endDate,
          drawDate: group.drawDate,
        },
        membership: queriedMember.member.role,
      }
    }
  })
})
