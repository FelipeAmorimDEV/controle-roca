/* eslint-disable no-useless-constructor */

import { FornecedorRepository } from '@/repository/fornecedor-repository'
import { Fornecedor } from '@prisma/client'

interface FetchAllFornecedoresUseCaseResponse {
  fornecedores: Fornecedor[]
}

export class FetchAllFornecedoresUseCase {
  constructor(private fornecedoreRepository: FornecedorRepository) {}

  async execute(): Promise<FetchAllFornecedoresUseCaseResponse> {
    const fornecedores = await this.fornecedoreRepository.fetchAllFornecedor()

    return { fornecedores }
  }
}
