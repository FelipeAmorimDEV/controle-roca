import { PrismaSetorRepository } from '@/repository/prisma/prisma-setor-repository'
import { FetchAllApontamentoUseCase } from '@/usecases/fetch-all-apontamentos'
import { FetchAllApontamentoNaoConcluidoUseCase } from '@/usecases/fetch-all-apontamentos-nao-concluido-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchApontamentoTotal(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const prismaSetorRepository = new PrismaSetorRepository()
  const fetchApontamentos = new FetchAllApontamentoUseCase(
    prismaSetorRepository,
  )

  const { apontamentos } = await fetchApontamentos.execute({
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send(apontamentos)
}
