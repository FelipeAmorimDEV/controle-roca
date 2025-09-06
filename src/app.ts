import fastify from 'fastify'
import { estoqueRoutes } from './http/routes'
import { fastifyCors } from '@fastify/cors'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { setupSwagger } from './swagger'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.SECRET_KEY,
})

app.register(fastifyCors)

// Configurar Swagger
setupSwagger(app)

app.register(estoqueRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: error.format(),
    })
  }

  console.log(error.message)

  return reply.status(500).send({ message: error.message })
})
