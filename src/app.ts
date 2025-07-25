import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { z, ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.', issue: z.formatError(error)
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    // TODO: here we should log to an external tool like DataDog/New Relic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." })
})
