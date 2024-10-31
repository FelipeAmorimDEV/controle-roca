/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { StockRepository } from '@/repository/stock-repository'

interface DeleteEntradaUseCaseParams {
  entradaId: string
}

export class DeleteEntradaUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private stockRepository: StockRepository,
  ) {}

  async execute({ entradaId }: DeleteEntradaUseCaseParams): Promise<null> {
    const entrada = await this.stockRepository.deleteEntrada(entradaId)

    await this.productsRepository.decrementProductQuantity(
      entrada.quantity,
      entrada.productId,
    )

    return null
  }
}
