/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { Product } from '@prisma/client'

interface EditProductUseCaseParams {
  name: string
  unit: string
  tipoId: string
  productId: string
}

interface EditProductsUseCaseResponse {
  product: Product
}

export class EditProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    unit,
    tipoId,
    productId,
  }: EditProductUseCaseParams): Promise<EditProductsUseCaseResponse> {
    const product = await this.productsRepository.edit(
      productId,
      unit,
      name,
      tipoId,
    )

    return { product }
  }
}
