import { Atividade, Prisma } from '@prisma/client'
import { AtividadeRepository } from '../atividade-repository'
import { prisma } from '@/prisma'

export class PrismaAtividadeRepository implements AtividadeRepository {
  async fetchAtividade(): Promise<Atividade[]> {
    const atividades = await prisma.atividade.findMany()

    return atividades
  }

  async createAtividade(data: Prisma.AtividadeCreateInput): Promise<Atividade> {
    const atividade = await prisma.atividade.create({
      data,
    })

    return atividade
  }
}
