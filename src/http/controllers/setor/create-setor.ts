import { PrismaSetorRepository } from '@/repository/prisma/prisma-setor-repository'
import { CreateSetorUseCase } from '@/usecases/create-setor-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createSetor(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    setorName: z.string(),
    variedade: z.coerce.number(),
    tamanhoArea: z.number(),
    filas: z.string(),
  })

  const { setorName, filas, tamanhoArea, variedade } = requestBodySchema.parse(
    request.body,
  )

  const prismaCreateSetorUseCase = new PrismaSetorRepository()
  const createSetorUseCase = new CreateSetorUseCase(prismaCreateSetorUseCase)

  const { setor } = await createSetorUseCase.execute({
    setorName: setorName.toUpperCase(),
    filas,
    tamanhoArea,
    variedade,
  })

  return reply.status(201).send(setor)
}
