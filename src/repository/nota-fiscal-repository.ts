import { ProdutosNotaFiscal } from '@/usecases/create-nota-fiscal-usecase'
import { FetchAllNotasFiscaisUseCaseResponse } from '@/usecases/fetch-all-notas-fiscais-usecase'
import { NotaFiscal, Prisma, ProdutoNota } from '@prisma/client'

type NotaFiscalProduto = {
  produtos: ProdutoNota[]
}

export interface NotaFiscalRepository {
  create(
    data: Prisma.NotaFiscalUncheckedCreateInput,
    produtos: ProdutosNotaFiscal[],
    userId: string,
    cultura: string,
  ): Promise<NotaFiscal>
  findById(notaFiscalId: string): Promise<NotaFiscal | null>
  delete(notaFiscalId: string): Promise<NotaFiscal & NotaFiscalProduto>
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
  changeStatus(notaFiscalId: string, status: string): Promise<NotaFiscal>
}
