/* eslint-disable no-useless-constructor */
import { Fornecedor } from '@prisma/client'
import { FornecedorRepository } from '@/repository/fornecedor-repository'

interface CreateFornecedorUseCaseParams {
  name: string
}

interface CreateFornecedorUseCaseResponse {
  fornecedor: Fornecedor
}

export class CreateFornecedorUseCase {
  constructor(private fornecedorRepository: FornecedorRepository) {}

  async execute({
    name,
  }: CreateFornecedorUseCaseParams): Promise<CreateFornecedorUseCaseResponse> {
    const fornecedor = await this.fornecedorRepository.createFornecedor({
      name,
    })

    return { fornecedor }
  }
}
