import { Prisma, Colheita } from '@prisma/client'
import {
  ColheitaRepository,
  ColheitaResult,
  IProducaoMensal,
} from '../colheita-repository'
import { prisma } from '@/prisma'
import { endOfMonth, set, startOfMonth } from 'date-fns'

export class PrismaColheitaRepository implements ColheitaRepository {
  async getProducaoMensal(): Promise<IProducaoMensal[]> {
    const resultados = []

    // Loop através dos meses de Janeiro (0) até Dezembro (11)
    for (let i = 0; i < 12; i++) {
      const anoAtual = new Date().getFullYear() // Obtendo o ano atual
      const inicioMes = startOfMonth(
        set(new Date(), { month: i, year: anoAtual }),
      ) // Definindo o primeiro dia do mês
      const fimMes = endOfMonth(inicioMes) // Definindo o último dia do mês

      const producaoMensal = await prisma.colheita.aggregate({
        where: {
          createdAt: {
            gte: inicioMes,
            lte: fimMes,
          },
        },
        _sum: {
          pesoTotal: true,
        },
      })

      resultados.push({
        mes: inicioMes.toLocaleString('default', { month: 'short' }), // Nome do mês
        quantidade: producaoMensal._sum.pesoTotal || 0, // Total produzido
      })
    }

    return resultados
  }

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
      include: {
        tipoCaixa: {
          select: {
            nome: true,
          },
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

  async createColheita(
    data: Prisma.ColheitaUncheckedCreateInput,
  ): Promise<Colheita> {
    const horaAtual = new Date().toISOString().split('T')[1]
    console.log(data.createdAt + horaAtual)
    const colheita = prisma.colheita.create({
      data: {
        pesoCaixa: data.pesoCaixa,
        pesoTotal: data.pesoTotal,
        qntCaixa: data.qntCaixa,
        setorId: data.setorId,
        caixa_id: data.caixa_id,
        createdAt: new Date(data.createdAt + 'T' + horaAtual),
      },
    })

    return colheita
  }
}
