import { Caixa, Prisma } from '@prisma/client'

import { CaixaRepository } from '../caixa-repository'
import { prisma } from '@/prisma'

export class PrismaCaixaRepository implements CaixaRepository {
  async fetchAllCaixa(fazendaId: string): Promise<Caixa[]> {
    const caixas = await prisma.caixa.findMany({
      where: {
        fazenda_id: fazendaId,
      },
    })

    return caixas
  }

  async createCaixa(data: Prisma.CaixaUncheckedCreateInput): Promise<Caixa> {
    const caixa = await prisma.caixa.create({
      data,
    })

    return caixa
  }
}
