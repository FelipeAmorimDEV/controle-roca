import { ApontamentoRepository } from '@/repository/apontamento-repository'
import { Apontamento } from '@prisma/client'

interface DeleteApontamentoUseCaseParams {
  apontamentoId: string
  fazenda_id: string
}

interface DeleteApontamentoUseCaseResponse {
  apontamento: Apontamento
}

export class DeleteApontamentoUseCase {
  constructor(private apontamentoRepository: ApontamentoRepository) {}

  async execute({
    apontamentoId,
    fazenda_id,
  }: DeleteApontamentoUseCaseParams): Promise<DeleteApontamentoUseCaseResponse> {
    const apontamento = await this.apontamentoRepository.deleteApontamento(
      apontamentoId,
      fazenda_id,
    )

    return { apontamento }
  }
}
