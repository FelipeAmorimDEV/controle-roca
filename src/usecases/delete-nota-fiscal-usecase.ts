/* eslint-disable no-useless-constructor */
import { NotaFiscalRepository } from '@/repository/nota-fiscal-repository'

interface DeleteNotaFiscalUseCaseParams {
  notaFiscalId: string
}

export class DeleteNotaFiscalUseCase {
  constructor(private notaFiscalRepository: NotaFiscalRepository) {}

  async execute({
    notaFiscalId,
  }: DeleteNotaFiscalUseCaseParams): Promise<null> {
    const notaFiscal = await this.notaFiscalRepository.delete(notaFiscalId)
    console.log(notaFiscal)
    console.log(notaFiscal.produtos)

    return null
  }
}
