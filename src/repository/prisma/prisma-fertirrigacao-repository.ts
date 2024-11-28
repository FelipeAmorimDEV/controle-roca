import { Fertirrigacao, Prisma } from '@prisma/client'

import { prisma } from '@/prisma'
import { FertirrigacaoRepository } from '../fertirrigacao-repository'
import { ProdutosNotaFiscalS } from '@/usecases/create-fertirrigacao-usecase'

export class PrismaFertirrigacaoRepository implements FertirrigacaoRepository {
  async delete(fertirrigacaoId: string): Promise<Fertirrigacao> {
    const fertirrigacao = await prisma.fertirrigacao.delete({
      where: {
        id: fertirrigacaoId,
      },
      include: {
        produtos: true,
      },
    })

    return fertirrigacao
  }

  async fetchMany(
    fazendaId: string,
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    setorId?: string,
  ) {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const allFertirrigacoes = await prisma.fertirrigacao.findMany({
      where: {
        fazenda_id: fazendaId,
        setor_id: setorId,
        created_at: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
    })

    const fertirrigacoes = await prisma.fertirrigacao.findMany({
      where: {
        fazenda_id: fazendaId,
        setor_id: setorId,
        created_at: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        produtos: {
          select: {
            quantidade: true,
            produto_id: true,
            produto: {
              select: {
                name: true,
              },
            },
          },
        },
        setor: {
          include: {
            variedade: {
              select: {
                nome: true,
              },
            },
          },
        },
        funcionario: {
          select: {
            nome: true,
          },
        },
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return { fertirrigacoes, total: allFertirrigacoes.length }
  }

  async create(
    data: Prisma.FertirrigacaoUncheckedCreateInput,
    produtos: ProdutosNotaFiscalS[],
  ) {
    const fertirrigacao = await prisma.fertirrigacao.create({
      data: {
        semana: data.semana,
        aplicador_id: data.aplicador_id,
        setor_id: data.setor_id,
        fazenda_id: data.fazenda_id,
        produtos: {
          create: produtos.map((produto) => {
            console.log(produto)
            return {
              quantidade: produto.quantidade,
              produto: {
                connect: { id: produto.produtoId },
              },
            }
          }),
        },
      },
    })

    return fertirrigacao
  }
}
