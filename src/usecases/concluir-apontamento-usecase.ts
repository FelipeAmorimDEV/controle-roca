import { ApontamentoRepository } from '@/repository/apontamento-repository'
import { Apontamento } from '@prisma/client'

interface ConcluirApontamentoUseCaseParams {
  apontamentoId: string
}

interface ConcluirApontamentoUseCaseResponse {
  apontamento: Apontamento
}

export class ConcluirApontamentoUseCase {
  constructor(private apontamentoRepository: ApontamentoRepository) {}

  async execute({
    apontamentoId,
  }: ConcluirApontamentoUseCaseParams): Promise<ConcluirApontamentoUseCaseResponse> {
    const apontamento =
      await this.apontamentoRepository.concluirApontamento(apontamentoId)

    return { apontamento }
  }
}
