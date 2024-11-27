import { ColheitaRepository } from '@/repository/colheita-repository'

interface AtualizaPrecoColheitaUseCaseParams {
  fazenda_id: string
}

export class AtualizaPrecoColheitaUseCase {
  constructor(private colheitaRepository: ColheitaRepository) {}

  async execute({ fazenda_id }: AtualizaPrecoColheitaUseCaseParams) {
    await this.colheitaRepository.atualizarValores(fazenda_id)
  }
}
