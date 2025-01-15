import { PrecoVenda, Prisma } from '@prisma/client'

import { PrecoVendaRepository } from '../preco-venda-repository'
import { prisma } from '@/prisma'

export class PrismaPrecoVendaRepository implements PrecoVendaRepository {
  async fetchManyByFarmId(farmId: string) {
    const precosVenda = await prisma.precoVenda.findMany({
      where: {
        fazenda_id: farmId
      }
    })

    return precosVenda
  }

  async create(
    data: Prisma.PrecoVendaUncheckedCreateInput,
  ): Promise<PrecoVenda> {
    const precoVenda = await prisma.precoVenda.create({
      data,
    })

    return precoVenda
  }

  async delete(precoVendaId: string) {
    const precoVenda = await prisma.precoVenda.delete({
      where: {
        id: precoVendaId
      }
    })

    return precoVenda
  }
}
