import { ColheitaRepository } from '@/repository/colheita-repository'

interface DeleteColheitaUseCaseParams {
  colheitaId: string
}

export class DeleteColheitaUseCase {
  constructor(private colheitaRepository: ColheitaRepository) {}

  async execute({ colheitaId }: DeleteColheitaUseCaseParams): Promise<null> {
    await this.colheitaRepository.deleteColheita(colheitaId)

    return null
  }
}
