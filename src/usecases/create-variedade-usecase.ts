import { VariedadeRepository } from '@/repository/variedade-repository'
import { Variedade } from '@prisma/client'

interface CreateVariedadeUseCaseParams {
  nome: string
  fazenda_id: string
}

interface CreateVariedadeUseCaseResponse {
  variedade: Variedade
}

export class CreateVariedadeUseCase {
  constructor(private variedadeRepository: VariedadeRepository) {}

  async execute({
    nome,
    fazenda_id,
  }: CreateVariedadeUseCaseParams): Promise<CreateVariedadeUseCaseResponse> {
    const variedade = await this.variedadeRepository.createVariedade({
      nome,
      fazenda_id,
    })

    return { variedade }
  }
}
