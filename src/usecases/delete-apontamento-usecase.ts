import { ApontamentoRepository } from '@/repository/apontamento-repository'
import { Apontamento } from '@prisma/client'

interface DeleteApontamentoUseCaseParams {
  apontamentoId: string
}

interface DeleteApontamentoUseCaseResponse {
  apontamento: Apontamento
}

export class DeleteApontamentoUseCase {
  constructor(private apontamentoRepository: ApontamentoRepository) {}

  async execute({
    apontamentoId,
  }: DeleteApontamentoUseCaseParams): Promise<DeleteApontamentoUseCaseResponse> {
    const apontamento =
      await this.apontamentoRepository.deleteApontamento(apontamentoId)

    return { apontamento }
  }
}
