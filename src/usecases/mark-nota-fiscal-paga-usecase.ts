import { PrismaNotaFiscalRepository } from '@/repository/prisma/prisma-nota-fiscal-repository'
import { ResouceNotFoundError } from './errors/resource-not-found'

interface MarkNotaFiscalPagaUseCaseParams {
  notaFiscalId: string
}

export class MarkNotaFiscalPagaUseCase {
  constructor(private notaFiscalRepository: PrismaNotaFiscalRepository) {}

  async execute({ notaFiscalId }: MarkNotaFiscalPagaUseCaseParams) {
    const notaFiscal = await this.notaFiscalRepository.findById(notaFiscalId)

    if (!notaFiscal) {
      throw new ResouceNotFoundError()
    }

    const notaStatus =
      notaFiscal.statusPagamento === 'pendente' ? 'pago' : 'pendente'

    await this.notaFiscalRepository.changeStatus(notaFiscalId, notaStatus)

    return null
  }
}
