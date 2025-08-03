import fastify from 'fastify'
import { z, ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { userRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET
})

app.register(userRoutes)
app.register(gymsRoutes)

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
