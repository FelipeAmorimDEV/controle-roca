import { Fornecedor, Prisma } from '@prisma/client'

export interface FornecedorRepository {
  createFornecedor(
    data: Prisma.FornecedorUncheckedCreateInput,
  ): Promise<Fornecedor>
  fetchAllFornecedor(fazendaId: string): Promise<Fornecedor[]>
}
