import { PrismaNotaFiscalRepository } from '@/repository/prisma/prisma-nota-fiscal-repository'
import { NotaFiscal } from '@prisma/client'

interface MarkNotaFiscalPagaUseCaseResponse {
  notaFiscal: NotaFiscal
}

interface MarkNotaFiscalPagaUseCaseParams {
  notaFiscalId: string
}

export class MarkNotaFiscalPagaUseCase {
  constructor(private notaFiscalRepository: PrismaNotaFiscalRepository) {}

  async execute({
    notaFiscalId,
  }: MarkNotaFiscalPagaUseCaseParams): Promise<MarkNotaFiscalPagaUseCaseResponse> {
    const notaFiscal = await this.notaFiscalRepository.markPaid(notaFiscalId)

    return { notaFiscal }
  }
}
