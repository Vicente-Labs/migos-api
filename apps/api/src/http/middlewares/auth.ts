import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import * as jose from 'jose'

import { env } from '@/env'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req) => {
    req.getCurrentUserId = async () => {
      if (!req.headers.authorization) {
        throw new UnauthorizedError('Missing auth token.')
      }

      const token = req.headers.authorization
        .replace('Bearer ', '')
        .trim()
        .replace(/^,\s*/, '')

      const secretKey = new TextEncoder().encode(env.JWT_SECRET)
      const { payload } = await jose.jwtVerify(token, secretKey, {
        algorithms: ['HS256'],
      })

      if (!payload.sub) {
        throw new UnauthorizedError('Invalid token.')
      }

      return { sub: payload.sub }
    }
  })
})
