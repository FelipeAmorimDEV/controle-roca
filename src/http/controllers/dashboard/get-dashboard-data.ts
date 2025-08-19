import { PrismaColheitaRepository } from '@/repository/prisma/prisma-colheita-repository'
import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { GetDashboardDataUseCase } from '@/usecases/get-dashboard-data-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getDashboardData(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const productRepository = new PrismaProductRepository()
  const stockRepository = new PrismaStockRepository()
  const colheitaRepository = new PrismaColheitaRepository()
  const getDashBoardData = new GetDashboardDataUseCase(
    productRepository,
    stockRepository,
    colheitaRepository,
  )

  const {
    totalEmStock,
    totalEntrada,
    totalProduto,
    totalSaida,
    colheitaMes,
    estoqueBaixo,
    tipoCaixa
  } = await getDashBoardData.execute({
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send({
    totalEmStock,
    totalEntrada,
    totalProduto,
    totalSaida,
    colheitaMes,
    estoqueBaixo,
    tipoCaixa
  })
}
