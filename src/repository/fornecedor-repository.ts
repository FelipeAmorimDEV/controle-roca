import { Fornecedor, Prisma } from '@prisma/client'

export interface FornecedorRepository {
  createFornecedor(data: Prisma.FornecedorCreateInput): Promise<Fornecedor>
  fetchAllFornecedor(): Promise<Fornecedor[]>
}
