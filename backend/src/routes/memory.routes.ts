import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../infra/db'

export default (app: FastifyInstance): void => {
  app.get('/memories', async () => {
    const memories = await db.memory.findMany({
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

  app.get('/memories/:id', async req => {
    const { id } = z
      .object({
        id: z.string()
      })
      .parse(req.params)

    const memory = await db.memory.findUniqueOrThrow({
      where: {
        id
      }
    })

    return memory
  })

  app.post('/memories', async req => {
    const data = z
      .object({
        userId: z.string(),
        content: z.string(),
        coverUrl: z.string(),
        isPublic: z.coerce.boolean().default(false)
      })
      .parse(req.body)

    await db.memory.create({ data })
  })

  app.put('/memories/:id', async req => {
    const { id } = z
      .object({
        id: z.string().nonempty()
      })
      .parse(req.params)

    const data = z
      .object({
        content: z.string(),
        coverUrl: z.string(),
        isPublic: z.coerce.boolean().default(false)
      })
      .parse(req.body)

    await db.memory.update({
      data,
      where: {
        id
      }
    })
  })

  app.delete('/memories/:id', async req => {
    const { id } = z
      .object({
        id: z.string().nonempty()
      })
      .parse(req.params)

    await db.memory.delete({
      where: {
        id
      }
    })
  })
}
