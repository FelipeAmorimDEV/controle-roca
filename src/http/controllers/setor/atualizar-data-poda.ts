import { PrismaSetorRepository } from '@/repository/prisma/prisma-setor-repository'
import { AtualizaDataPodaUseCase } from '@/usecases/atualizar-data-poda-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function atualizarDataPoda(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    setorId: z.string(),
    dataPoda: z.coerce.date()
  })

  const { setorId, dataPoda } = requestBodySchema.parse(
    request.body,
  )

  const prismaCreateSetorUseCase = new PrismaSetorRepository()
  const atualizarDataPoda = new AtualizaDataPodaUseCase(prismaCreateSetorUseCase)

 await atualizarDataPoda.execute({
    setorId,
    dataPoda
  })

  return reply.status(200).send({message: "Data da poda atualizada com sucesso!"})
}
