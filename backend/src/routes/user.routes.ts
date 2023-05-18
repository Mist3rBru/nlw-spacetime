import { FastifyInstance } from 'fastify'
import { db } from '../infra/db'

export default (app: FastifyInstance): void => {
  app.get('/users', async () => {
    return db.user.findMany()
  })
}
