import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '@/db'
import { users } from '@/db/schemas'
import { BadRequestError } from '@/http/_errors/bad-request-errors'
import { googleClient, oauth2 } from '@/lib/google'

export async function registerAccountWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/users/google',
    {
      schema: {
        tags: ['auth'],
        description: 'Register account with Google',
        querystring: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            message: z.literal('User created successfully'),
          }),
          400: z.object({
            message: z.enum([
              'User info not found',
              'Invalid or expired authorization code',
              'Validation error',
            ]),
            errors: z
              .object({
                code: z.array(z.string()).optional(),
              })
              .optional(),
          }),
          500: z.object({
            message: z.literal('Internal server error'),
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

        if (!userInfo.data.email || !userInfo.data.name || !userInfo.data.id)
          throw new BadRequestError('User info not found')

        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, userInfo.data.email.toLowerCase()))
          .limit(1)

        if (existingUser && !existingUser.providerId) {
          await db
            .update(users)
            .set({
              provider: 'GOOGLE',
              providerId: userInfo.data.id,
            })
            .where(eq(users.id, existingUser.id))

          return res.status(204).send()
        }

        await db.insert(users).values({
          email: userInfo.data.email.toLowerCase(),
          name: userInfo.data.name,
          provider: 'GOOGLE',
          providerId: userInfo.data.id,
          avatarUrl: userInfo.data.picture,
        })

        return res.status(201).send({
          message: 'User created successfully',
        })
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
