import 'fastify'

import type { Role } from '@migos/auth'

import type { Group } from '@/db/schemas'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<{ sub: string }>
    getUserMembership(id: string): Promise<{
      group: Group
      membership: Role
    }>
  }
}
