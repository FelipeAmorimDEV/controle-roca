import { PrismaNotaFiscalRepository } from '@/repository/prisma/prisma-nota-fiscal-repository'
import { getDataLimit } from '@/utils/data-limit'
import { NotaFiscal } from '@prisma/client'

interface FetchAllNotasFiscaisVencendoUseCaseResponse {
  notasFiscais: NotaFiscal[]
}

interface FetchAllNotasFiscaisVencendoUseCaseParams {
  fazenda_id: string
}

export class FetchAllNotasFiscaisVencendoUseCase {
  constructor(private notaFiscalRepository: PrismaNotaFiscalRepository) {}

  async execute({
    fazenda_id,
  }: FetchAllNotasFiscaisVencendoUseCaseParams): Promise<FetchAllNotasFiscaisVencendoUseCaseResponse> {
    const dataLimite = getDataLimit(7)

    const notasFiscais =
      await this.notaFiscalRepository.fetchNotasFiscaisVencendo(
        fazenda_id,
        dataLimite,
      )

    return { notasFiscais }
  }
}
