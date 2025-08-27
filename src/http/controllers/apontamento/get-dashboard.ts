import { PrismaApontamentoRepository } from '@/repository/prisma/prisma-apontamento-repository'
import { DeleteApontamentoUseCase } from '@/usecases/delete-apontamento-usecase'
import { GetApontamentosDashBoardUseCase } from '@/usecases/get-apontamentos-dashboard'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getApontamentoDashboard(
  request: FastifyRequest,
  reply: FastifyReply,
) {




  const apontamentoRepository = new PrismaApontamentoRepository()
  const deleteApontamento = new GetApontamentosDashBoardUseCase(apontamentoRepository)

  const { apontamentos, dashboard } = await deleteApontamento.execute({
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send({apontamentos, dashboard})
}
