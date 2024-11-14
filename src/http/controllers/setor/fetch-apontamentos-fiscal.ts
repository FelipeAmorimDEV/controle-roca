import { PrismaSetorRepository } from '@/repository/prisma/prisma-setor-repository'
import { FetchAllApontamentoNaoConcluidoUseCase } from '@/usecases/fetch-all-apontamentos-nao-concluido-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchApontamentoFiscal(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const prismaSetorRepository = new PrismaSetorRepository()
  const fetchApontamentos = new FetchAllApontamentoNaoConcluidoUseCase(
    prismaSetorRepository,
  )

  const { apontamentos } = await fetchApontamentos.execute({
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send(apontamentos)
}
