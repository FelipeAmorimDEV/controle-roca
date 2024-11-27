import { Fornecedor, Prisma } from '@prisma/client'

import { prisma } from '@/prisma'
import { FornecedorRepository } from '../fornecedor-repository'

export class PrismaFornecedorRepository implements FornecedorRepository {
  async createFornecedor(
    data: Prisma.FornecedorUncheckedCreateInput,
  ): Promise<Fornecedor> {
    const fornecedor = await prisma.fornecedor.create({
      data,
    })

    return fornecedor
  }

  async fetchAllFornecedor(fazendaId: string): Promise<Fornecedor[]> {
    const fornecedores = await prisma.fornecedor.findMany({
      where: {
        fazenda_id: fazendaId,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return fornecedores
  }
}
