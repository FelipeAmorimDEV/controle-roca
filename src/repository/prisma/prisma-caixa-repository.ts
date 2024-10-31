import { Caixa, Prisma, Qrcodes } from '@prisma/client'

import { CaixaRepository } from '../caixa-repository'
import { prisma } from '@/prisma'

export class PrismaCaixaRepository implements CaixaRepository {
  async fetchAllCaixa(): Promise<Caixa[]> {
    const caixas = await prisma.caixa.findMany()

    return caixas
  }

  async createCaixa(data: Prisma.CaixaCreateInput): Promise<Caixa> {
    const caixa = await prisma.caixa.create({
      data
    })

    return caixa
  }
}
