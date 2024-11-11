import { Aplicacao } from '@prisma/client'
import { prisma } from '@/prisma'
import { AplicacaoRepository, CreateAplicacao } from '../aplicacao-repository'

export class PrismaAplicacaoRepository implements AplicacaoRepository {
  async delete(aplicacaoId: string): Promise<Aplicacao> {
    const aplicacao = await prisma.aplicacao.delete({
      where: {
        id: aplicacaoId,
      },
    })

    return aplicacao
  }

  async fetchAplicacao(
    fazendaId: string,
    initialDate: string,
    endDate: string,
    perPage: number,
    page: number,
    setorId?: string,
  ) {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const aplicacoes = await prisma.aplicacao.findMany({
      where: {
        fazenda_id: fazendaId,
        setorId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      include: {
        setor: {
          select: {
            setorName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    const aplicacoesTotal = await prisma.aplicacao.findMany({
      where: {
        fazenda_id: fazendaId,
        setorId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
    })

    return { aplicacoes, totalAplicacoes: aplicacoesTotal.length }
  }

  async createAplicacao(data: CreateAplicacao): Promise<Aplicacao> {
    const aplicacao = await prisma.aplicacao.create({
      data,
    })

    return aplicacao
  }
}
