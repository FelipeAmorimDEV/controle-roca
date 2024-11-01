/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { StockRepository } from '@/repository/stock-repository'
import { Product } from '@prisma/client'

interface DeleteProductUseCaseParams {
  productId: string
}

interface DeleteProductsUseCaseResponse {
  product: Product
}

export class DeleteProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private stockRepository: StockRepository,
  ) {}

  async execute({
    productId,
  }: DeleteProductUseCaseParams): Promise<DeleteProductsUseCaseResponse> {
    await this.stockRepository.deleteAllEntradas(productId)
    await this.stockRepository.deleteAllSaidas(productId)
    const product = await this.productsRepository.deleteProduct(productId)

    return { product }
  }
}
