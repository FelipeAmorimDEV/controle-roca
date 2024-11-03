/* eslint-disable no-useless-constructor */
import { Tipo } from '@prisma/client'
import { TipoRepository } from '@/repository/tipo-repository'

interface CreateTipoUseCaseParams {
  name: string
  fazenda_id: string
}

interface CreateTipoUseCaseResponse {
  tipo: Tipo
}

export class CreateTipoUseCase {
  constructor(private tipoRepository: TipoRepository) {}

  async execute({
    name,
    fazenda_id,
  }: CreateTipoUseCaseParams): Promise<CreateTipoUseCaseResponse> {
    const tipo = await this.tipoRepository.createTipo({ name, fazenda_id })

    return { tipo }
  }
}
