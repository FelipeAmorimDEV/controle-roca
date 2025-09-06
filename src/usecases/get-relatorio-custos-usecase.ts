import { ManutencaoRepository, RelatorioCustomos } from '@/repository/manutencao-repository'

interface GetRelatorioCustosUseCaseParams {
  tratarId: string
  fazenda_id: string
  dataInicial?: string
  dataFinal?: string
}

export class GetRelatorioCustosUseCase {
  constructor(private manutencaoRepository: ManutencaoRepository) {}

  async execute(params: GetRelatorioCustosUseCaseParams): Promise<RelatorioCustomos> {
    return await this.manutencaoRepository.getRelatorioCustomos(
      params.tratarId,
      params.fazenda_id,
      params.dataInicial,
      params.dataFinal
    )
  }
}