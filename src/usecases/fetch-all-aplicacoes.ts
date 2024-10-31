/* eslint-disable no-useless-constructor */

import { AplicacaoRepository } from '@/repository/aplicacao-repository'
import { Aplicacao } from '@prisma/client'

interface FetchAllAplicacoesUseCaseResponse {
  aplicacoes: Aplicacao[]
}

export class FetchAllAplicacoesUseCase {
  constructor(private aplicacaoRepository: AplicacaoRepository) {}

  async execute(): Promise<FetchAllAplicacoesUseCaseResponse> {
    const aplicacoes = await this.aplicacaoRepository.fetchAplicacao()

    return { aplicacoes }
  }
}
