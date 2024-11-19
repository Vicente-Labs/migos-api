import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import * as jose from 'jose'
import z from 'zod'

import { db } from '@/db'
import { users } from '@/db/schemas'
import { env } from '@/env'
import { BadRequestError } from '@/http/_errors/bad-request-errors'
import { googleClient, oauth2 } from '@/lib/google'

export async function authenticateWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/authenticate/google',
    {
      schema: {
        tags: ['auth'],
        description: 'Authenticate with Google',
        querystring: z.object({
          code: z.string(),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            message: z.enum([
              'User info not found',
              'User not found',
              'Invalid or expired authorization code',
            ]),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      try {
        const { code } = req.query

        const { tokens } = await googleClient.getToken(code)
        googleClient.setCredentials(tokens)

        const userInfo = await oauth2.userinfo.get({ auth: googleClient })

        if (!userInfo.data.email || !userInfo.data.name || !userInfo.data.id) {
          throw new BadRequestError('User info not found')
        }

        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, userInfo.data.email.toLowerCase()))
          .limit(1)

        if (!existingUser) {
          throw new BadRequestError('User not found')
        }
        const secret = new TextEncoder().encode(env.JWT_SECRET)

        const token = await new jose.SignJWT({ sub: existingUser.id })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('7d')
          .setIssuedAt()
          .sign(secret)

        return res.status(200).send({ token })
      } catch (error) {
        if (error instanceof Error && 'response' in error) {
          const gaxiosError = error as unknown as {
            response?: { data?: { error?: string } }
          }
          if (gaxiosError.response?.data?.error === 'invalid_grant') {
            throw new BadRequestError('Invalid or expired authorization code')
          }
        }
        throw error
      }
    },
  )
}
