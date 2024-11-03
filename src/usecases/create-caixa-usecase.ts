import { CaixaRepository } from '@/repository/caixa-repository'
import { Caixa } from '@prisma/client'

interface CreateCaixaUseCaseParams {
  nome: string
  fazenda_id: string
}

interface CreateCaixaUseCaseResponse {
  caixa: Caixa
}

export class CreateCaixaUseCase {
  constructor(private caixaRepository: CaixaRepository) {}

  async execute({
    nome,
    fazenda_id,
  }: CreateCaixaUseCaseParams): Promise<CreateCaixaUseCaseResponse> {
    const caixa = await this.caixaRepository.createCaixa({ nome, fazenda_id })

    return { caixa }
  }
}
