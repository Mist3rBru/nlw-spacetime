import fastify from 'fastify'
import {PrismaClient} from '@prisma/client'

const db = new PrismaClient()
const app = fastify()

app.get('/users', async () => {
  return await db.user.findMany()
})

app
  .listen({ port: 3030 })
  .then(() => {
    process.stdout.write('Server running on port 3030')
  })
