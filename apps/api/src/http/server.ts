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
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
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

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
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

app.register(registerAccountWithPassword)
app.register(registerAccountWithGoogle)
app.register(authenticateWithPassword)

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

app
  .listen({
    host: '0.0.0.0',
    port: env.BACKEND_PORT,
  })
  .then(() => console.log('HTTP server is running!'))
