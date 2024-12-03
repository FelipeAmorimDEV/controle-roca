import { PrismaNotaFiscalRepository } from '@/repository/prisma/prisma-nota-fiscal-repository'
import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { CreateNotaFiscalUseCase } from '@/usecases/create-nota-fiscal-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createNotaFiscal(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    cultura: z.enum(['uva', 'manga']).default('uva'),
    dataNota: z.string(),
    dataPagamento: z.string().optional(),
    statusPagamento: z.string().optional(),
    codigoDeBarras: z.string().optional(),
    codigoNota: z.string().optional(),
    fornecedorId: z.string(),
    produtos: z.array(
      z.object({
        productId: z.string(),
        quantidade: z.coerce.number(),
        valor: z.coerce.number(),
      }),
    ),
  })

  const {
    dataNota,
    produtos,
    dataPagamento,
    statusPagamento,
    codigoDeBarras,
    fornecedorId,
    codigoNota,
    cultura,
  } = requestBodySchema.parse(request.body)

  const notaFiscalRepository = new PrismaNotaFiscalRepository()
  const productRepository = new PrismaProductRepository()
  const stockRepository = new PrismaStockRepository()
  const createNotaFiscal = new CreateNotaFiscalUseCase(
    notaFiscalRepository,
    productRepository,
    stockRepository,
  )

  const { notaFiscal } = await createNotaFiscal.execute({
    fazenda_id: request.user.fazenda_id,
    dataNota,
    dataPagamento,
    produtos,
    statusPagamento,
    user_id: request.user.sub,
    fornecedorId,
    codigoDeBarras,
    codigoNota,
    cultura,
  })

  return reply.status(201).send(notaFiscal)
}
