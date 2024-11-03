import { VariedadeRepository } from '@/repository/variedade-repository'
import { Variedade } from '@prisma/client'

interface FetchAllVariedadesUseCaseResponse {
  variedades: Variedade[]
}

export class FetchAllVariedadesUseCase {
  constructor(private variedadesRepository: VariedadeRepository) {}

  async execute(): Promise<FetchAllVariedadesUseCaseResponse> {
    const variedades = await this.variedadesRepository.fetchAllVariedades()

    return { variedades }
  }
}
