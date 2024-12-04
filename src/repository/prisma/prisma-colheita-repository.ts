import { Prisma, Colheita } from '@prisma/client'

import {
  ColheitaRepository,
  ColheitaResult,
  IProducaoMensal,
} from '../colheita-repository'
import { prisma } from '@/prisma'
import { endOfMonth, set, startOfMonth } from 'date-fns'

export class PrismaColheitaRepository implements ColheitaRepository {
  async atualizarValores(fazendaId: string): Promise<string> {
    const colheitasAtualizadas = await prisma.$executeRaw`
      UPDATE "colheitas"
      SET "preco_venda_id" = (
        SELECT pv."id"
        FROM "precos_venda" pv
        JOIN "caixas" c ON "colheitas"."caixa_id" = c."id"
        WHERE "colheitas"."preco_venda_id" IS NULL
          AND "colheitas"."fazenda_id" = ${fazendaId}
          AND c."nome" = pv."classificacao"
          AND "colheitas"."createdAt" BETWEEN pv."dataInicio" AND pv."dataFim"
        LIMIT 1
      )
      WHERE "colheitas"."fazenda_id" = ${fazendaId}
      AND "colheitas"."preco_venda_id" IS NULL;
    `

    return `${colheitasAtualizadas} colheitas atualizadas com sucesso`
  }

  async getProducaoMensal(fazendaId: string): Promise<IProducaoMensal[]> {
    const resultados = []

    for (let i = 0; i < 12; i++) {
      const anoAtual = new Date().getFullYear()
      const inicioMes = startOfMonth(
        set(new Date(), { month: i, year: anoAtual }),
      )
      const fimMes = endOfMonth(inicioMes)

      // Agregação por variedade e soma de peso total
      const producoesPorVariedade = await prisma.colheita.groupBy({
        by: ['variedade'],
        where: {
          fazenda_id: fazendaId,
          createdAt: {
            gte: inicioMes,
            lte: fimMes,
          },
        },
        _sum: {
          pesoTotal: true,
        },
      })

      // Constrói o objeto de variedades com a quantidade total por variedade
      const variedades: { [variedade: string]: number } = {}
      producoesPorVariedade.forEach((producao) => {
        variedades[producao.variedade.toUpperCase()] =
          producao._sum.pesoTotal || 0
      })

      // Calcula a quantidade total do mês
      const quantidadeTotalMes = producoesPorVariedade.reduce(
        (total, producao) => total + (producao._sum.pesoTotal || 0),
        0,
      )

      resultados.push({
        mes: inicioMes.toLocaleString('default', { month: 'short' }),
        TOTAL: quantidadeTotalMes,
        ...variedades,
      })
    }

    return resultados
  }

  async deleteColheita(
    colheitaId: string,
    fazendaId: string,
  ): Promise<Colheita> {
    const colheita = await prisma.colheita.delete({
      where: {
        id: colheitaId,
        fazenda_id: fazendaId,
      },
    })

    return colheita
  }

  async fetchAllColheita(
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    fazendaId: string,
    setorId?: string,
    variedade?: string,
  ): Promise<ColheitaResult> {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    console.log(setorId)

    const totalColhido = await prisma.colheita.aggregate({
      where: {
        fazenda_id: fazendaId,
        setorId,
        variedade,
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
        fazenda_id: fazendaId,
        setorId,
        variedade,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      include: {
        preco_venda: true,
      },
    })

    const lucroTotal = totalColheita.reduce(
      (acc, prev) =>
        acc + (Number(prev.preco_venda?.preco) ?? 0) * prev.qntCaixa,
      0,
    )

    const colheita = await prisma.colheita.findMany({
      where: {
        fazenda_id: fazendaId,
        setorId,
        variedade,
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
        setor: {
          select: {
            setorName: true,
          },
        },
        preco_venda: {
          select: {
            preco: true,
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
      lucroTotal,
    }
  }

  async createColheita(
    data: Prisma.ColheitaUncheckedCreateInput,
  ): Promise<Colheita> {
    const horaAtual = new Date().toISOString().split('T')[1]
    const colheita = await prisma.colheita.create({
      data: {
        pesoCaixa: data.pesoCaixa,
        pesoTotal: data.pesoTotal,
        qntCaixa: data.qntCaixa,
        setorId: data.setorId,
        caixa_id: data.caixa_id,
        createdAt: new Date(data.createdAt + 'T' + horaAtual),
        variedade: data.variedade,
        fazenda_id: data.fazenda_id,
      },
    })

    return colheita
  }
}
