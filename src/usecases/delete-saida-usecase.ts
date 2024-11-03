/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { StockRepository } from '@/repository/stock-repository'

interface DeleteSaidaUseCaseParams {
  saidaId: string
  fazenda_id: string
}

export class DeleteSaidaUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private stockRepository: StockRepository,
  ) {}

  async execute({
    saidaId,
    fazenda_id,
  }: DeleteSaidaUseCaseParams): Promise<null> {
    const saida = await this.stockRepository.deleteSaida(saidaId, fazenda_id)

    await this.productsRepository.incrementProductQuantity(
      saida.quantity,
      saida.productId,
      fazenda_id,
    )

    return null
  }
}
