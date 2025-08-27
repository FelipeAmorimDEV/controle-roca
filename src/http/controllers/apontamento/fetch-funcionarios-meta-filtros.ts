import { PrismaApontamentoRepository } from "@/repository/prisma/prisma-apontamento-repository"
import { GetFuncionariosMetasExcedidasUseCase } from "@/usecases/get-meta-execida"
import { GetFuncionariosMetaExcedidaFiltrossUseCase } from "@/usecases/get-meta-execida-filtro"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function getFuncionariosMetaFiltro(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getFuncionariosMetasExcedidasQuerySchema = z.object({
    dataInicio: z.string().transform((val) => new Date(val)),
    dataFim: z.string().transform((val) => new Date(val)),
    atividadeNome: z.string().optional(),
    funcionarioNome: z.string().optional()
  })

  try {
    const { dataInicio, dataFim, atividadeNome, funcionarioNome } = getFuncionariosMetasExcedidasQuerySchema.parse(request.query)

    const apontamentoRepository = new PrismaApontamentoRepository()
    const getFuncionariosMetasExcedidasUseCase = new GetFuncionariosMetaExcedidaFiltrossUseCase(apontamentoRepository)

    const { funcionarios } = await getFuncionariosMetasExcedidasUseCase.execute({
      fazenda_id: request.user.fazenda_id,
      dataInicio,
      dataFim,
      atividadeNome,
      funcionarioNome
    })

    return reply.status(200).send({ funcionarios })
  } catch (error) {
    return reply.status(400).send({
      error: 'Erro ao buscar funcionários com metas excedidas',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}