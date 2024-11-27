import { PrecoVenda, Prisma } from '@prisma/client'

export interface PrecoVendaRepository {
  create(data: Prisma.PrecoVendaUncheckedCreateInput): Promise<PrecoVenda>
}
