import { PrismaApontamentoRepository } from "@/repository/prisma/prisma-apontamento-repository"
import { GetFuncionariosMetasExcedidasUseCase } from "@/usecases/get-meta-execida"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function getFuncionariosMetasExcedidas(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getFuncionariosMetasExcedidasQuerySchema = z.object({
    dataInicio: z.string().transform((val) => new Date(val)),
    dataFim: z.string().transform((val) => new Date(val)),
  })

  try {
    const { dataInicio, dataFim } = getFuncionariosMetasExcedidasQuerySchema.parse(request.query)

    const apontamentoRepository = new PrismaApontamentoRepository()
    const getFuncionariosMetasExcedidasUseCase = new GetFuncionariosMetasExcedidasUseCase(apontamentoRepository)

    const funcionarios = await getFuncionariosMetasExcedidasUseCase.execute({
      fazenda_id: request.user.fazenda_id,
      dataInicio,
      dataFim,
    })

    return reply.status(200).send({ funcionarios })
  } catch (error) {
    return reply.status(400).send({ 
      error: 'Erro ao buscar funcionários com metas excedidas',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}