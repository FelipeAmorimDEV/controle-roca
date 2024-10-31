import { CaixaRepository } from '@/repository/caixa-repository'
import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { Caixa } from '@prisma/client'

interface CreateCaixaUseCaseParams {
  nome: string
}

interface CreateCaixaUseCaseResponse {
  caixa: Caixa
}

export class CreateCaixaUseCase {
  constructor(private caixaRepository: CaixaRepository) {}

  async execute({
    nome,
  }: CreateCaixaUseCaseParams): Promise<CreateCaixaUseCaseResponse> {
    const caixa = await this.caixaRepository.createCaixa({nome})

    return { caixa }
  }
}
