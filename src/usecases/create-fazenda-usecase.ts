import { Fazenda } from '@prisma/client'
import { FazendaRepository } from '@/repository/fazenda-repository'

interface CreateFazendaUseCaseParams {
  nome: string
}

interface CreateFazendaUseCaseResponse {
  fazenda: Fazenda
}

export class CreateFazendaUseCase {
  constructor(private fazendaRepository: FazendaRepository) {}

  async execute({
    nome,
  }: CreateFazendaUseCaseParams): Promise<CreateFazendaUseCaseResponse> {
    const fazenda = await this.fazendaRepository.createFazenda({ nome })

    return { fazenda }
  }
}
