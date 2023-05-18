import cors from '@fastify/cors'
import fastify, { FastifyInstance } from 'fastify'
import { setupRoutes } from './routes'

export async function setupApp(): Promise<FastifyInstance> {
  const app = fastify()

  app.register(cors, {
    origin: '*'
  })

  await setupRoutes(app)

  return app
}
