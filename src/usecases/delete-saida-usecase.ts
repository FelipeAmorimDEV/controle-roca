/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { StockRepository } from '@/repository/stock-repository'

interface DeleteSaidaUseCaseParams {
  saidaId: string
}

export class DeleteSaidaUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private stockRepository: StockRepository,
  ) {}

  async execute({ saidaId }: DeleteSaidaUseCaseParams): Promise<null> {
    const saida = await this.stockRepository.deleteSaida(saidaId)

    await this.productsRepository.incrementProductQuantity(
      saida.quantity,
      saida.productId,
    )

    return null
  }
}
