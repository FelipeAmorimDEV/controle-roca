import { Atividade, Prisma } from '@prisma/client'
import { AtividadeRepository } from '../atividade-repository'
import { prisma } from '@/prisma'

export class PrismaAtividadeRepository implements AtividadeRepository {
  async fetchAtividade(fazendaId: string): Promise<Atividade[]> {
    const atividades = await prisma.atividade.findMany({
      where: {
        fazenda_id: fazendaId,
      },
    })

    return atividades
  }

  async createAtividade(
    data: Prisma.AtividadeUncheckedCreateInput,
  ): Promise<Atividade> {
    const atividade = await prisma.atividade.create({
      data,
    })

    return atividade
  }
}
