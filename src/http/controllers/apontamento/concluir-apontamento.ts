import { PrismaApontamentoRepository } from '@/repository/prisma/prisma-apontamento-repository'
import { PrismaAtividadeRepository } from '@/repository/prisma/prisma-atividade-repository'
import { PrismaFuncionarioRepository } from '@/repository/prisma/prisma-funcionaro-repository'
import { ConcluirApontamentoUseCase } from '@/usecases/concluir-apontamento-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function concluirApontamento(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    apontamentoId: z.string().uuid(),
  })
  const requestBodySchema = z.object({
    dataConclusao: z.string(),
    qtdAtividade: z.coerce.number(),
  })

  const { apontamentoId } = requestParamsSchema.parse(request.params)
  const { dataConclusao, qtdAtividade } = requestBodySchema.parse(request.body)

  const apontamentoRepository = new PrismaApontamentoRepository()
  const funcionarioRepository = new PrismaFuncionarioRepository()
  const atividadeRepository = new PrismaAtividadeRepository()

  const concluirApontamento = new ConcluirApontamentoUseCase(
    apontamentoRepository,
    funcionarioRepository,
    atividadeRepository,
  )

  await concluirApontamento.execute({
    apontamentoId,
    fazenda_id: request.user.fazenda_id,
    dataConclusao,
    qtdAtividade,
  })

  return reply.status(200).send()
}
