import { NotaFiscal, Prisma } from '@prisma/client'

import { prisma } from '@/prisma'
import { NotaFiscalRepository } from '../nota-fiscal-repository'
import { ProdutosNotaFiscal } from '@/usecases/create-nota-fiscal-usecase'

export class PrismaNotaFiscalRepository implements NotaFiscalRepository {
  async fetchNotasFiscais(
    fazendaId: string,
    page: number,
    perPage: number,
    initialDate: string,
    endDate: string,
    fornecedorId?: string,
    status?: string,
  ) {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const notasFiscais = await prisma.notaFiscal.findMany({
      where: {
        fornecedor_id: fornecedorId,
        statusPagamento: status,
        fazenda_id: fazendaId,
        dataNota: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      include: {
        fornecedor: {
          select: {
            name: true,
          },
        },
        produtos: true,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return notasFiscais
  }

  async create(
    data: Prisma.NotaFiscalUncheckedCreateInput,
    produtos: ProdutosNotaFiscal[],
  ): Promise<NotaFiscal> {
    const notaFiscal = await prisma.notaFiscal.create({
      data: {
        dataNota: new Date(data.dataNota),
        dataPagamento: data.dataPagamento ? new Date(data.dataPagamento) : null,
        statusPagamento: data.statusPagamento,
        codigo_de_barras: data.codigo_de_barras,
        fornecedor: {
          connect: {
            id: data.fornecedor_id,
          },
        },
        fazenda: {
          connect: {
            id: data.fazenda_id,
          },
        },
        produtos: {
          create: produtos.map((produtoi) => ({
            quantidade: produtoi.quantidade,
            valor: produtoi.valor,
            produto: {
              connect: {
                id: produtoi.productId,
              },
            },
          })),
        },
      },
      include: {
        produtos: true,
      },
    })

    return notaFiscal
  }
}
