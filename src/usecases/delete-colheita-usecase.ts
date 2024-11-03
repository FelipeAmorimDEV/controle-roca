import { ColheitaRepository } from '@/repository/colheita-repository'

interface DeleteColheitaUseCaseParams {
  colheitaId: string
  fazenda_id: string
}

export class DeleteColheitaUseCase {
  constructor(private colheitaRepository: ColheitaRepository) {}

  async execute({
    colheitaId,
    fazenda_id,
  }: DeleteColheitaUseCaseParams): Promise<null> {
    await this.colheitaRepository.deleteColheita(colheitaId, fazenda_id)

    return null
  }
}
