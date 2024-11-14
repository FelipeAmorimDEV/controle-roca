import { PrismaFolhaPagamento } from '@/repository/prisma/prisma-folha-pagamento-repository'
import { PrismaFuncionarioRepository } from '@/repository/prisma/prisma-funcionaro-repository'
import { CreateFolhaPagamentoUseCase } from '@/usecases/create-folha-de-pagamento-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createFolhaPagamento(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    mes: z.string(),
  })

  const { mes } = requestParamsSchema.parse(request.params)

  const funcionarioRepository = new PrismaFuncionarioRepository()
  const folhaPagamentoRepository = new PrismaFolhaPagamento()

  const createFolhaPagamento = new CreateFolhaPagamentoUseCase(
    folhaPagamentoRepository,
    funcionarioRepository,
  )

  const mesReferencia = new Date(`${mes}-10`)

  const { folhaPagamento } = await createFolhaPagamento.execute({
    fazenda_id: request.user.fazenda_id,
    mesReferencia,
  })

  return reply.status(201).send(folhaPagamento)
}
