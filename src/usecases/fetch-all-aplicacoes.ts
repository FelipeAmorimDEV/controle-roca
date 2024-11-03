/* eslint-disable no-useless-constructor */

import { AplicacaoRepository } from '@/repository/aplicacao-repository'
import { Aplicacao } from '@prisma/client'

interface FetchAllAplicacoesUseCaseResponse {
  aplicacoes: Aplicacao[]
}
interface FetchAllAplicacoesUseCaseParams {
  fazenda_id: string
}
export class FetchAllAplicacoesUseCase {
  constructor(private aplicacaoRepository: AplicacaoRepository) {}

  async execute({
    fazenda_id,
  }: FetchAllAplicacoesUseCaseParams): Promise<FetchAllAplicacoesUseCaseResponse> {
    const aplicacoes = await this.aplicacaoRepository.fetchAplicacao(fazenda_id)

    return { aplicacoes }
  }
}
