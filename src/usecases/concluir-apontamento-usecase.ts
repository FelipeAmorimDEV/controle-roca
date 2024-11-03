import { ApontamentoRepository } from '@/repository/apontamento-repository'
import { Apontamento } from '@prisma/client'

interface ConcluirApontamentoUseCaseParams {
  apontamentoId: string
  fazenda_id: string
}

interface ConcluirApontamentoUseCaseResponse {
  apontamento: Apontamento
}

export class ConcluirApontamentoUseCase {
  constructor(private apontamentoRepository: ApontamentoRepository) {}

  async execute({
    apontamentoId,
    fazenda_id,
  }: ConcluirApontamentoUseCaseParams): Promise<ConcluirApontamentoUseCaseResponse> {
    const apontamento = await this.apontamentoRepository.concluirApontamento(
      apontamentoId,
      fazenda_id,
    )

    return { apontamento }
  }
}
