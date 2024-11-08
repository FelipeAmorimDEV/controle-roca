import { Saida, Entrada, Prisma } from '@prisma/client'
import {
  EntradasResult,
  SaidasResult,
  StockRepository,
} from '../stock-repository'
import { prisma } from '@/prisma'

export class PrismaStockRepository implements StockRepository {
  async getTotalEntrada(fazendaId: string): Promise<number> {
    const totalEntrada = await prisma.entrada.findMany({
      where: {
        fazenda_id: fazendaId,
      },
    })

    return totalEntrada.length
  }

  async getTotalSaida(fazendaId: string): Promise<number> {
    const totalSaida = await prisma.saida.findMany({
      where: {
        fazenda_id: fazendaId,
      },
    })

    return totalSaida.length
  }

  async deleteAllSaidas(
    productId: string,
    fazendaId: string,
  ): Promise<Prisma.BatchPayload> {
    const saidas = await prisma.saida.deleteMany({
      where: {
        productId,
        fazenda_id: fazendaId,
      },
    })

    return saidas
  }

  async deleteAllEntradas(
    productId: string,
    fazendaId: string,
  ): Promise<Prisma.BatchPayload> {
    const entradas = await prisma.entrada.deleteMany({
      where: {
        productId,
        fazenda_id: fazendaId,
      },
    })

    return entradas
  }

  async deleteSaida(saidaId: string, fazendaId: string): Promise<Saida> {
    const saida = await prisma.saida.delete({
      where: {
        id: saidaId,
        fazenda_id: fazendaId,
      },
    })

    return saida
  }

  async deleteEntrada(entradaId: string): Promise<Entrada> {
    const entrada = await prisma.entrada.delete({
      where: {
        id: entradaId,
      },
    })

    return entrada
  }

  async fetchSaidas(
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    fazendaId: string,
    productId?: string,
    setorId?: string,
  ): Promise<SaidasResult> {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const totalSaidas = await prisma.saida.findMany({
      where: {
        fazenda_id: fazendaId,
        productId,
        setorId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
    })

    const totalValue = await prisma.saida.aggregate({
      where: {
        fazenda_id: fazendaId,
        productId,
        setorId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      _sum: {
        priceSaida: true,
      },
    })

    const saidas = await prisma.saida.findMany({
      where: {
        fazenda_id: fazendaId,
        productId,
        setorId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Product: {
          select: {
            name: true,
            unit: true,
          },
        },
        setor: {
          select: {
            setorName: true,
          },
        },
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return {
      saidas,
      total: totalSaidas.length,
      saidasTotal: totalValue._sum.priceSaida,
    }
  }

  async fetchEntradas(
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    fazendaId: string,
    productId?: string,
  ): Promise<EntradasResult> {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const totalEntradas = await prisma.entrada.findMany({
      where: {
        fazenda_id: fazendaId,
        productId,
        createdAt: {
          lte: new Date(endDateOfTheDay),
          gte: new Date(initialDate),
        },
      },
    })

    const totalValue = await prisma.entrada.aggregate({
      where: {
        fazenda_id: fazendaId,
        productId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      _sum: {
        priceEntrada: true,
      },
    })

    const entradas = await prisma.entrada.findMany({
      where: {
        fazenda_id: fazendaId,
        productId,
        createdAt: {
          lte: new Date(endDateOfTheDay),
          gte: new Date(initialDate),
        },
      },
      include: {
        Product: {
          select: {
            name: true,
            unit: true,
          },
        },
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    return {
      entradas,
      total: totalEntradas.length,
      entradasTotal: totalValue._sum.priceEntrada,
    }
  }

  async createWithdrawStockItemLog(
    quantity: number,
    productId: string,
    setorId: string,
    priceSaida: number,
    createdIn: string,
    userId: string,
    fazendaId: string,
    aplicacaoId?: string,
  ): Promise<Saida> {
    console.log(createdIn)
    const dateTime = new Date().toISOString().split('T')[1]
    const dataReal = createdIn + 'T' + dateTime

    const withdrawOperation = await prisma.saida.create({
      data: {
        quantity,
        productId,
        setorId,
        priceSaida,
        createdAt: new Date(dataReal),
        usersId: userId,
        fazenda_id: fazendaId,
        aplicacaoId,
      },
    })

    return withdrawOperation
  }

  async createInsertStockItemLog(
    quantity: number,
    priceEntrada: number,
    productId: string,
    createdIn: string,
    price: number,
    userId: string,
    fazendaId: string,
  ): Promise<Entrada> {
    const dateTime = new Date().toISOString().split('T')[1]
    const dataReal = createdIn + 'T' + dateTime

    const inputOperation = await prisma.entrada.create({
      data: {
        productId,
        quantity,
        priceEntrada,
        createdAt: new Date(dataReal),
        price,
        usersId: userId,
        fazenda_id: fazendaId,
      },
    })

    return inputOperation
  }
}
