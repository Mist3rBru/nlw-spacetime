import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../infra/db'

export default (app: FastifyInstance): void => {
  app.get('/memories', async req => {
    await req.jwtVerify()

    const memories = await db.memory.findMany({
      where: {
        userId: req.user.sub
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    return memories.map(memory => ({
      id: memory.id,
      excerpt: memory.content.substring(0, 115).concat('...'),
      coverUrl: memory.coverUrl,
      createdAt: memory.createdAt
    }))
  })

  app.get('/memories/:id', async (req, reply) => {
    await req.jwtVerify()

    const paramsSchema = z.object({
      id: z.string()
    })
    const { id } = paramsSchema.parse(req.params)

    const memory = await db.memory.findUniqueOrThrow({
      where: {
        id
      }
    })
    if (!memory.isPublic && memory.userId !== req.user.sub) {
      return reply.status(401).send()
    }

    return memory
  })

  app.post('/memories', async req => {
    await req.jwtVerify()

    const bodySchema = z.object({
      userId: z.string(),
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })
    const data = bodySchema.parse(req.body)

    await db.memory.create({ data })
  })

  app.put('/memories/:id', async (req, reply) => {
    await req.jwtVerify()

    const paramsSchema = z.object({
      id: z.string()
    })
    const { id } = paramsSchema.parse(req.params)

    const memory = await db.memory.findUniqueOrThrow({
      where: {
        id
      }
    })
    if (memory.userId !== req.user.sub) {
      return reply.status(401).send()
    }

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })
    const data = bodySchema.parse(req.body)

    await db.memory.update({
      data,
      where: {
        id
      }
    })
  })

  app.delete('/memories/:id', async (req, reply) => {
    await req.jwtVerify()

    const paramsSchema = z.object({
      id: z.string()
    })
    const { id } = paramsSchema.parse(req.params)

    const memory = await db.memory.findUniqueOrThrow({
      where: {
        id
      }
    })
    if (memory.userId !== req.user.sub) {
      return reply.status(401).send()
    }

    await db.memory.delete({
      where: {
        id
      }
    })
  })
}
