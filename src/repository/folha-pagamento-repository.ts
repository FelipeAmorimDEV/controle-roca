import { FolhaPagamento, Prisma } from '@prisma/client'

export interface FolhaPagamentoRepository {
  createOrUpdate(
    data: Prisma.FolhaPagamentoUncheckedCreateInput,
  ): Promise<FolhaPagamento>
}
