import { FastifyInstance } from 'fastify'
import {z} from "zod"
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map(memory => {
      return{
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.Content.substring(0, 115).concat("...")
      }
    })
  })

  app.get('/memories/:id', async (req) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const {id} = paramsSchema.parse(req.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where:{
        id,
      }
    })

    return memory
  })

  app.post('/memories', async (req) => {
    const bodySchema = z.object({
      Content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })

    const { Content,coverUrl, isPublic} = bodySchema.parse(req.body)

    const memory = await prisma.memory.create({
      data:{
        Content,
        coverUrl,
        isPublic,
        userId:"882478db-abdc-470c-90d8-97daeac959ca"
      }
    })

    return memory
  })

  app.put('/memories/:id', async (req) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const {id} = paramsSchema.parse(req.params)

    const bodySchema = z.object({
      Content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })

    const { Content,coverUrl, isPublic} = bodySchema.parse(req.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        Content,
        coverUrl,
        isPublic,
      }
    })

    return memory

  })

  app.delete('/memories/:id', async (req) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const {id} = paramsSchema.parse(req.params)

    await prisma.memory.delete({
      where:{
        id,
      }
    })
  })
}
