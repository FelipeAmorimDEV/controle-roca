import { CaixaRepository } from '@/repository/caixa-repository'
import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { Caixa, Funcionario } from '@prisma/client'

interface FetchAllCaixasUseCaseParams {
  nome: string
}

interface FetchAllCaixasUseCaseResponse {
  caixas: Caixa[]
}

export class FetchAllCaixasUseCase {
  constructor(private caixaRepository: CaixaRepository) {}

  async execute({}): Promise<FetchAllCaixasUseCaseResponse> {
    const caixas = await this.caixaRepository.fetchAllCaixa()

    return { caixas }
  }
}
