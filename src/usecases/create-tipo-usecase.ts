/* eslint-disable no-useless-constructor */
import { Tipo } from '@prisma/client'
import { TipoRepository } from '@/repository/tipo-repository'

interface CreateTipoUseCaseParams {
  name: string
}

interface CreateTipoUseCaseResponse {
  tipo: Tipo
}

export class CreateTipoUseCase {
  constructor(private tipoRepository: TipoRepository) {}

  async execute({
    name,
  }: CreateTipoUseCaseParams): Promise<CreateTipoUseCaseResponse> {
    const tipo = await this.tipoRepository.createTipo({ name })

    return { tipo }
  }
}
