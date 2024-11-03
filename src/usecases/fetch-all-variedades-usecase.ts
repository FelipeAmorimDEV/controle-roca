import { VariedadeRepository } from '@/repository/variedade-repository'
import { Variedade } from '@prisma/client'

interface FetchAllVariedadesUseCaseResponse {
  variedades: Variedade[]
}

interface FetchAllVariedadesUseCaseProps {
  fazenda_id: string
}

export class FetchAllVariedadesUseCase {
  constructor(private variedadesRepository: VariedadeRepository) {}

  async execute({
    fazenda_id,
  }: FetchAllVariedadesUseCaseProps): Promise<FetchAllVariedadesUseCaseResponse> {
    const variedades =
      await this.variedadesRepository.fetchAllVariedades(fazenda_id)

    return { variedades }
  }
}
