/* eslint-disable no-useless-constructor */

import { FornecedorRepository } from '@/repository/fornecedor-repository'
import { Fornecedor } from '@prisma/client'

interface FetchAllFornecedoresUseCaseResponse {
  fornecedores: Fornecedor[]
}

interface FetchAllFornecedoresUseCaseParams {
  fazenda_id: string
}

export class FetchAllFornecedoresUseCase {
  constructor(private fornecedoreRepository: FornecedorRepository) {}

  async execute({
    fazenda_id,
  }: FetchAllFornecedoresUseCaseParams): Promise<FetchAllFornecedoresUseCaseResponse> {
    const fornecedores =
      await this.fornecedoreRepository.fetchAllFornecedor(fazenda_id)

    return { fornecedores }
  }
}
