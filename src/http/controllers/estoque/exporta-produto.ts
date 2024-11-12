import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { ExportaProdutoUseCase } from '@/usecases/exportar-produtos-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function exportarProduto(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const productRepository = new PrismaProductRepository()
  const exportaProduto = new ExportaProdutoUseCase(productRepository)

  const { buffer } = await exportaProduto.execute({
    fazenda_id: request.user.fazenda_id,
  })

  return reply
    .header('Content-Disposition', 'attachment; filename="produtos.xlsx"')
    .header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    .send(buffer)
}
