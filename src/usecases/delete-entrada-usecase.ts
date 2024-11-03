/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { StockRepository } from '@/repository/stock-repository'

interface DeleteEntradaUseCaseParams {
  entradaId: string
  fazenda_id: string
}

export class DeleteEntradaUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private stockRepository: StockRepository,
  ) {}

  async execute({
    entradaId,
    fazenda_id,
  }: DeleteEntradaUseCaseParams): Promise<null> {
    const entrada = await this.stockRepository.deleteEntrada(
      entradaId,
      fazenda_id,
    )

    await this.productsRepository.decrementProductQuantity(
      entrada.quantity,
      entrada.productId,
      fazenda_id,
    )

    return null
  }
}
