import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { BadRequestError } from '@/http/_errors/bad-request-errors'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'

import { NotFoundError } from './_errors/not-found-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (err, req, res) => {
  if (err instanceof ZodError) {
    console.error('Err', err.flatten())

    return res.status(400).send({
      message: 'Validation error',
      errors: err.flatten().fieldErrors || err.flatten().formErrors,
    })
  }

  if (err instanceof BadRequestError)
    return res.status(400).send({ message: err.message })

  if (err instanceof UnauthorizedError)
    return res.status(401).send({ message: err.message })

  if (err instanceof NotFoundError)
    return res.status(404).send({ message: err.message })

  console.error(err) // TODO: here we should send this error to an observability service

  return res.status(500).send({ message: 'Internal server error' })
}
