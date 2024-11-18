import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { BadRequestError } from '@/_errors/bad-request-errors'
import { UnauthorizedError } from '@/_errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (err, req, res) => {
  if (err instanceof ZodError)
    return res
      .status(400)
      .send({ message: 'Validation error', errors: err.flatten().fieldErrors })

  if (err instanceof BadRequestError)
    return res.status(400).send({ message: err.message })

  if (err instanceof UnauthorizedError)
    return res.status(401).send({ message: err.message })

  console.error(err) // TODO: here we should send this error to an observability service

  return res.status(500).send({ message: 'Internal server error' })
}
