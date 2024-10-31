/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { Product } from '@prisma/client'

interface CreateProductUseCaseParams {
  name: string
  unit: string
  fornecedorId: string
  tipoId: string
}

interface CreateProductsUseCaseResponse {
  product: Product
}

export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    unit,
    fornecedorId,
    tipoId,
  }: CreateProductUseCaseParams): Promise<CreateProductsUseCaseResponse> {
    const product = await this.productsRepository.createProduct({
      name,
      unit,
      fornecedorId,
      tipoId,
    })

    return { product }
  }
}
