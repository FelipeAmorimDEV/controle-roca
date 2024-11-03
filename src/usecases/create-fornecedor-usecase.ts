/* eslint-disable no-useless-constructor */
import { Fornecedor } from '@prisma/client'
import { FornecedorRepository } from '@/repository/fornecedor-repository'

interface CreateFornecedorUseCaseParams {
  name: string
  fazenda_id: string
}

interface CreateFornecedorUseCaseResponse {
  fornecedor: Fornecedor
}

export class CreateFornecedorUseCase {
  constructor(private fornecedorRepository: FornecedorRepository) {}

  async execute({
    name,
    fazenda_id,
  }: CreateFornecedorUseCaseParams): Promise<CreateFornecedorUseCaseResponse> {
    const fornecedor = await this.fornecedorRepository.createFornecedor({
      name,
      fazenda_id,
    })

    return { fornecedor }
  }
}
