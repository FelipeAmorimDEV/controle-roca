import { PrecoVenda, Prisma } from '@prisma/client'

import { PrecoVendaRepository } from '../preco-venda-repository'
import { prisma } from '@/prisma'

export class PrismaPrecoVendaRepository implements PrecoVendaRepository {
  async create(
    data: Prisma.PrecoVendaUncheckedCreateInput,
  ): Promise<PrecoVenda> {
    const precoVenda = await prisma.precoVenda.create({
      data,
    })

    return precoVenda
  }
}
