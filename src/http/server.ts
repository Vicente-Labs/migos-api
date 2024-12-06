import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { env } from '@/env'

import { errorHandler } from './error-handler'
import { authenticateWithGoogle } from './routes/auth/authenticate-with-google'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { preRegisterRoute } from './routes/auth/pre-register'
import { registerAccountWithGoogle } from './routes/auth/register-account-with-google'
import { registerAccountWithPassword } from './routes/auth/register-account-with-password'
import { getAuthenticatedProfile } from './routes/geral/get-authenticated-profile'
import { getProfile } from './routes/geral/get-profile'
import { createGroup } from './routes/group/create-group'
import { deleteGroup } from './routes/group/delete-group'
import { fetchGroups } from './routes/group/fetch-groups'
import { generateMatches } from './routes/group/generate-matches'
import { getGroup } from './routes/group/get-group'
import { getMyMatch } from './routes/group/get-my-match'
import { transferGroupOwnership } from './routes/group/transfer-group-ownership'
import { updateDescription } from './routes/group/update-description'
import { acceptInvite } from './routes/invites/accept-invite'
import { createInvite } from './routes/invites/create-invite'
import { fetchInvites } from './routes/invites/fetch-invites'
import { getPendingInvites } from './routes/invites/fetch-pending-invites'
import { getInvite } from './routes/invites/get-invite'
import { revokeInvite } from './routes/invites/revoke-invite'

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    servers: [
      { url: 'https://api.migos.me', description: 'Production' },
      {
        url: `http://localhost:${env.BACKEND_PORT}`,
        description: 'Development',
      },
    ],
    info: {
      title: 'Migos | API Specs',
      description: 'API documentation for Migos',
      version: '0.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors) // any front-end can access this API

app.get('/health', async (_req, res) => {
  return res.status(200).send({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
  })
})

app.register(registerAccountWithPassword)
app.register(registerAccountWithGoogle)
app.register(authenticateWithPassword)
app.register(authenticateWithGoogle)
app.register(preRegisterRoute)

app.register(getAuthenticatedProfile)
app.register(getProfile)

app.register(createGroup)
app.register(deleteGroup)
app.register(updateDescription)
app.register(transferGroupOwnership)
app.register(fetchGroups)
app.register(getGroup)
app.register(generateMatches)
app.register(getMyMatch)

app.register(createInvite)
app.register(acceptInvite)
app.register(fetchInvites)
app.register(revokeInvite)
app.register(getPendingInvites)
app.register(getInvite)

app.listen({
  host: env.HOST,
  port: env.BACKEND_PORT,
})
