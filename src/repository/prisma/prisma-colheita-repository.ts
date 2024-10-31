import { Prisma, Colheita } from '@prisma/client'
import { ColheitaRepository, ColheitaResult } from '../colheita-repository'
import { prisma } from '@/prisma'

export class PrismaColheitaRepository implements ColheitaRepository {
  async deleteColheita(colheitaId: string): Promise<Colheita> {
    const colheita = await prisma.colheita.delete({
      where: {
        id: colheitaId,
      },
    })

    return colheita
  }

  async fetchAllColheita(
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    setorId?: string,
  ): Promise<ColheitaResult> {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const totalColhido = await prisma.colheita.aggregate({
      where: {
        setorId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      _sum: {
        pesoTotal: true,
      },
    })

    const totalColheita = await prisma.colheita.findMany({
      where: {
        setorId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
    })

    const colheita = await prisma.colheita.findMany({
      where: {
        setorId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      colheita,
      total: totalColheita.length,
      totalColhido: totalColhido._sum.pesoTotal,
    }
  }

  async createColheita(data: Prisma.ColheitaCreateInput): Promise<Colheita> {
    const horaAtual = new Date().toISOString().split('T')[1]
    console.log(data.createdAt + horaAtual)
    const colheita = prisma.colheita.create({
      data: {
        pesoCaixa: data.pesoCaixa,
        pesoTotal: data.pesoTotal,
        qntCaixa: data.qntCaixa,
        setorId: data.setorId,
        tipoCaixa: data.tipoCaixa,
        createdAt: new Date(data.createdAt + 'T' + horaAtual),
      },
    })

    return colheita
  }
}
