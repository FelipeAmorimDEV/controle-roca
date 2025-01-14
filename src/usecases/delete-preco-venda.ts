import { PrecoVendaRepository } from '@/repository/preco-venda-repository'
import { PrecoVenda } from '@prisma/client'

interface DeletePrecoVendaUseCaseParams {
  precoVendaId: string
}

interface DeletePrecoVendaUseCaseResponse {
  precoVenda: PrecoVenda
}

export class DeletePrecoVendaUseCase {
  constructor(private precoVendaRepository: PrecoVendaRepository) { }

  async execute({
    precoVendaId
  }: DeletePrecoVendaUseCaseParams): Promise<DeletePrecoVendaUseCaseResponse> {
    const precoVenda = await this.precoVendaRepository.delete(precoVendaId)

    return { precoVenda }
  }
}
