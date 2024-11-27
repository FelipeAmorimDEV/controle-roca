import { PrecoVendaRepository } from '@/repository/preco-venda-repository'
import { PrecoVenda } from '@prisma/client'

interface CreatePrecoVendaUseCaseParams {
  classificacao: string
  preco: number
  dataInicio: string
  dataFim: string
  fazenda_id: string
}

interface CreatePrecoVendaUseCaseResponse {
  precoVenda: PrecoVenda
}

export class CreatePrecoVendaUseCase {
  constructor(private precoVendaRepository: PrecoVendaRepository) {}

  async execute({
    classificacao,
    dataFim,
    dataInicio,
    preco,
    fazenda_id,
  }: CreatePrecoVendaUseCaseParams): Promise<CreatePrecoVendaUseCaseResponse> {
    const precoVenda = await this.precoVendaRepository.create({
      classificacao,
      dataFim,
      dataInicio,
      preco,
      fazenda_id,
    })

    return { precoVenda }
  }
}
