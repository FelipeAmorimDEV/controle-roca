import { ApontamentoRepository } from '@/repository/apontamento-repository'
import { AtividadesRecentesResult, CardsSuperioresResponseDTO } from '@/repository/prisma/prisma-apontamento-repository'
import { Apontamento } from '@prisma/client'

interface GetApontamentosDashBoardUseCaseParams {
  fazenda_id: string
}

interface GetApontamentosDashBoardUseCaseResponse {
  apontamentos: AtividadesRecentesResult
  dashboard: CardsSuperioresResponseDTO
}

export class GetApontamentosDashBoardUseCase {
  constructor(private apontamentoRepository: ApontamentoRepository) {}

  async execute({
    fazenda_id,
  }: GetApontamentosDashBoardUseCaseParams): Promise<GetApontamentosDashBoardUseCaseResponse> {
    const dashboard = await this.apontamentoRepository.getCardsSuperiores(
      fazenda_id,
    )

    const apontamentos = await this.apontamentoRepository.getAtividadesRecentes(fazenda_id)

    return { apontamentos, dashboard }
  }
}
