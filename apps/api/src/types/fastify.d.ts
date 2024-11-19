import 'fastify'

import type { Role } from '@migos/auth'

import type { groups } from '@/db/schemas'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<{ sub: string }>
    getUserMembership(id: string): Promise<{
      group: typeof groups.$inferInsert
      membership: Role
    }>
  }
}
