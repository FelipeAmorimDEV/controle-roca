import { CaixaRepository } from '@/repository/caixa-repository'
import { Caixa } from '@prisma/client'

interface FetchAllCaixasUseCaseResponse {
  caixas: Caixa[]
}

export class FetchAllCaixasUseCase {
  constructor(private caixaRepository: CaixaRepository) {}

  async execute(): Promise<FetchAllCaixasUseCaseResponse> {
    const caixas = await this.caixaRepository.fetchAllCaixa()

    return { caixas }
  }
}
