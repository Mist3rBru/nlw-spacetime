import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify, { FastifyInstance } from 'fastify'
import { setupRoutes } from './routes'

export async function setupApp(): Promise<FastifyInstance> {
  const app = fastify()

  app.register(fastifyCors, {
    origin: '*'
  })

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string
  })

  await setupRoutes(app)

  return app
}
