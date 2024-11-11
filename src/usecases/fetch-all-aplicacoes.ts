/* eslint-disable no-useless-constructor */

import { AplicacaoRepository } from '@/repository/aplicacao-repository'
import { Aplicacao } from '@prisma/client'

interface FetchAllAplicacoesUseCaseResponse {
  aplicacoes: Aplicacao[]
  totalAplicacoes: number
}
interface FetchAllAplicacoesUseCaseParams {
  fazenda_id: string
  setorId?: string
  initialDate: string
  endDate: string
  page: number
  perPage: number
}
export class FetchAllAplicacoesUseCase {
  constructor(private aplicacaoRepository: AplicacaoRepository) {}

  async execute({
    fazenda_id,
    endDate,
    initialDate,
    page,
    perPage,
    setorId,
  }: FetchAllAplicacoesUseCaseParams): Promise<FetchAllAplicacoesUseCaseResponse> {
    const { aplicacoes, totalAplicacoes } =
      await this.aplicacaoRepository.fetchAplicacao(
        fazenda_id,
        initialDate,
        endDate,
        perPage,
        page,
        setorId,
      )

    return { aplicacoes, totalAplicacoes }
  }
}
