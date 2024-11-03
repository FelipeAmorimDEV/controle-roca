import { CaixaRepository } from '@/repository/caixa-repository'
import { Caixa } from '@prisma/client'

interface FetchAllCaixasUseCaseResponse {
  caixas: Caixa[]
}

interface FetchAllCaixasUseCaseParams {
  fazenda_id: string
}

export class FetchAllCaixasUseCase {
  constructor(private caixaRepository: CaixaRepository) {}

  async execute({
    fazenda_id,
  }: FetchAllCaixasUseCaseParams): Promise<FetchAllCaixasUseCaseResponse> {
    const caixas = await this.caixaRepository.fetchAllCaixa(fazenda_id)

    return { caixas }
  }
}
