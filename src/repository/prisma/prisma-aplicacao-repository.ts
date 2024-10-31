import { Aplicacao } from '@prisma/client'
import { prisma } from '@/prisma'
import { AplicacaoRepository, CreateAplicacao } from '../aplicacao-repository'

export class PrismaAplicacaoRepository implements AplicacaoRepository {
  async fetchAplicacao(): Promise<Aplicacao[]> {
    const aplicacoes = await prisma.aplicacao.findMany()

    return aplicacoes
  }

  async createAplicacao(data: CreateAplicacao): Promise<Aplicacao> {
    const aplicacao = await prisma.aplicacao.create({
      data,
    })

    return aplicacao
  }
}
