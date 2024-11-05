import { PrismaNotaFiscalRepository } from '@/repository/prisma/prisma-nota-fiscal-repository'
import { NotaFiscal } from '@prisma/client'

interface FetchAllNotasFiscaisUseCaseResponse {
  notasFiscais: NotaFiscal[]
}

interface FetchAllNotasFiscaisUseCaseParams {
  fazenda_id: string
  initialDate: string
  endDate: string
  page: number
  perPage: number
  status?: string
  fornecedorId?: string
}

export class FetchAllNotasFiscaisUseCase {
  constructor(private notaFiscalRepository: PrismaNotaFiscalRepository) {}

  async execute({
    fazenda_id,
    endDate,
    fornecedorId,
    initialDate,
    page,
    perPage,
    status,
  }: FetchAllNotasFiscaisUseCaseParams): Promise<FetchAllNotasFiscaisUseCaseResponse> {
    const notasFiscais = await this.notaFiscalRepository.fetchNotasFiscais(
      fazenda_id,
      page,
      perPage,
      initialDate,
      endDate,
      fornecedorId,
      status,
    )

    return { notasFiscais }
  }
}