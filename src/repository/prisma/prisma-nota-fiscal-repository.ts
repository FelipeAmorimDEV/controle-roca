import { NotaFiscal, Prisma } from '@prisma/client'

import { prisma } from '@/prisma'
import { NotaFiscalRepository } from '../nota-fiscal-repository'
import { ProdutosNotaFiscal } from '@/usecases/create-nota-fiscal-usecase'

export class PrismaNotaFiscalRepository implements NotaFiscalRepository {
  async delete(notaFiscalId: string) {
    const notaFiscal = await prisma.notaFiscal.delete({
      where: {
        id: notaFiscalId,
      },
      include: {
        produtos: true,
      },
    })

    return notaFiscal
  }

  async markPaid(notaFiscalId: string) {
    const notaFiscal = await prisma.notaFiscal.update({
      where: {
        id: notaFiscalId,
      },
      data: {
        statusPagamento: 'pago',
      },
    })

    return notaFiscal
  }

  async fetchNotasFiscaisVencendo(fazendaId: string, dataLimite: Date) {
    dataLimite.setUTCHours(23, 59, 59, 999)
    const startOfDay = new Date().setUTCHours(0, 0, 0, 0)
    const notasFiscais = await prisma.notaFiscal.findMany({
      where: {
        fazenda_id: fazendaId,
        dataPagamento: {
          gte: new Date(startOfDay),
          lte: dataLimite,
        },
        statusPagamento: 'pendente',
      },
      include: {
        fornecedor: {
          select: {
            name: true,
          },
        },
        produtos: true,
      },
    })

    return notasFiscais
  }

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

    const totalNotasFiscais = await prisma.notaFiscal.findMany({
      where: {
        fornecedor_id: fornecedorId,
        statusPagamento: status,
        fazenda_id: fazendaId,
        dataNota: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
    })

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
        produtos: {
          include: {
            produto: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        dataNota: 'desc',
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return { notasFiscais, total: totalNotasFiscais.length }
  }

  async create(
    data: Prisma.NotaFiscalUncheckedCreateInput,
    produtos: ProdutosNotaFiscal[],
    userId: string,
  ): Promise<NotaFiscal> {
    const dataNota = new Date(data.dataNota)
    dataNota.setUTCHours(4, 10, 10, 10)
    const dataPagamento = data.dataPagamento
      ? new Date(data.dataPagamento)
      : null
    dataPagamento?.setUTCHours(4, 10, 10, 10)

    const notaFiscal = await prisma.notaFiscal.create({
      data: {
        dataNota: new Date(dataNota),
        dataPagamento: dataPagamento ? new Date(dataPagamento) : null,
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
            entrada: {
              create: {
                priceEntrada: produtoi.valor,
                price: produtoi.valor / produtoi.quantidade,
                quantity: produtoi.quantidade,
                createdAt: new Date(),
                Product: {
                  connect: {
                    id: produtoi.productId,
                  },
                },
                fazenda: {
                  connect: {
                    id: data.fazenda_id,
                  },
                },
                Users: {
                  connect: {
                    id: userId,
                  },
                },
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
