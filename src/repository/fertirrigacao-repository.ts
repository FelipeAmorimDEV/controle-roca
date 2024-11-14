import { ProdutosNotaFiscalS } from '@/usecases/create-fertirrigacao-usecase'
import { Fertirrigacao, Prisma } from '@prisma/client'

export interface FertirrigacaoRepository {
  create(
    data: Prisma.FertirrigacaoUncheckedCreateInput,
    produtos: ProdutosNotaFiscalS[],
  ): Promise<Fertirrigacao>
  fetchMany(
    fazendaId: string,
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    setorId?: string,
  ): Promise<Fertirrigacao[]>
}
