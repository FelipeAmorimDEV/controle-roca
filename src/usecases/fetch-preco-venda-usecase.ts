/* eslint-disable no-useless-constructor */
import { PrecoVendaRepository } from '@/repository/preco-venda-repository'
import { PrecoVenda } from '@prisma/client'

interface FetchPrecoVendaUseCaseResponse {
  precosVenda: PrecoVenda[]
}

interface FetchPrecoVendaUseCaseParams {
  fazenda_id: string
}

export class FetchPrecoVendaUseCase {
  constructor(private precoVenda: PrecoVendaRepository) { }

  async execute({
    fazenda_id,
  }: FetchPrecoVendaUseCaseParams): Promise<FetchPrecoVendaUseCaseResponse> {
    const precosVenda =
      await this.precoVenda.fetchManyByFarmId(fazenda_id)

    return { precosVenda }
  }
}
