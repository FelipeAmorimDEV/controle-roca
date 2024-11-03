/* eslint-disable no-useless-constructor */
import { Setor } from '@prisma/client'
import { SetorRepository } from '@/repository/setor-repository'

interface CreateSetorUseCaseParams {
  setorName: string
  variedade: number
  tamanhoArea: number
  filas: string
  fazenda_id: string
}

interface CreateSetorUseCaseResponse {
  setor: Setor
}

export class CreateSetorUseCase {
  constructor(private setorRepository: SetorRepository) {}

  async execute({
    setorName,
    filas,
    tamanhoArea,
    variedade,
    fazenda_id,
  }: CreateSetorUseCaseParams): Promise<CreateSetorUseCaseResponse> {
    const setor = await this.setorRepository.createSetor({
      setorName,
      filas,
      tamanhoArea,
      variedade_id: variedade,
      fazenda_id,
    })

    return { setor }
  }
}
