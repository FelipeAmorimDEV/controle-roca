import { PrismaSetorRepository } from '@/repository/prisma/prisma-setor-repository'
import { FetchAllApontamentoLoteUseCase } from '@/usecases/fetch-all-apontamentos-lote'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchApontamentosSetor(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const prismaSetorRepository = new PrismaSetorRepository()
  const fetchApontamentos = new FetchAllApontamentoLoteUseCase(
    prismaSetorRepository,
  )

  const { apontamentos } = await fetchApontamentos.execute({
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send(apontamentos)
}
