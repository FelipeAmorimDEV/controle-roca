import { ProdutosNotaFiscal } from '@/usecases/create-nota-fiscal-usecase'
import { FetchAllNotasFiscaisUseCaseResponse } from '@/usecases/fetch-all-notas-fiscais-usecase'
import { NotaFiscal, Prisma } from '@prisma/client'

export interface NotaFiscalRepository {
  create(
    data: Prisma.NotaFiscalUncheckedCreateInput,
    produtos: ProdutosNotaFiscal[],
    userId: string,
  ): Promise<NotaFiscal>
  delete(notaFiscalId: string): Promise<NotaFiscal>
  fetchNotasFiscais(
    fazendaId: string,
    page: number,
    perPage: number,
    initialDate: string,
    endDate: string,
    fornecedorId?: string,
    status?: string,
  ): Promise<FetchAllNotasFiscaisUseCaseResponse>
  fetchNotasFiscaisVencendo(
    fazendaId: string,
    dataLimite: Date,
  ): Promise<NotaFiscal[]>
  markPaid(notaFiscalId: string): Promise<NotaFiscal>
}
