/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { StockRepository } from '@/repository/stock-repository'
import { Product } from '@prisma/client'

interface DeleteProductUseCaseParams {
  productId: string
  fazenda_id: string
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
    fazenda_id,
  }: DeleteProductUseCaseParams): Promise<DeleteProductsUseCaseResponse> {
    await this.stockRepository.deleteAllEntradas(productId, fazenda_id)
    await this.stockRepository.deleteAllSaidas(productId, fazenda_id)
    const product = await this.productsRepository.deleteProduct(
      productId,
      fazenda_id,
    )

    return { product }
  }
}
