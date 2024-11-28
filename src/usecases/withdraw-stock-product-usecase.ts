/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { Product, Saida } from '@prisma/client'
import { StockRepository } from '@/repository/stock-repository'
import { QuantityInvalidError } from './errors/quantity-invalid'
import { ResouceNotFoundError } from './errors/resource-not-found'
import { QuantityUnavailableError } from './errors/quantity-unavailable'

interface WithdrawStockProductUseCaseParams {
  productId: string
  quantity: number
  setorId: string
  createdIn: string
  userId: string
  fazenda_id: string
}

interface WithdrawStockProductUseCaseResponse {
  withdrawLog: Saida
  produtoAtualizado: Product
}

export class WithdrawStockUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private stockRepository: StockRepository,
  ) {}

  async execute({
    quantity,
    productId,
    setorId,
    createdIn,
    userId,
    fazenda_id,
  }: WithdrawStockProductUseCaseParams): Promise<WithdrawStockProductUseCaseResponse> {
    const isNotValidQuantity = quantity <= 0

    if (isNotValidQuantity) {
      throw new QuantityInvalidError('Quantity') // Testar
    }

    const product = await this.productsRepository.findProduct(
      productId,
      fazenda_id,
    )

    if (!product) {
      throw new ResouceNotFoundError()
    }

    if (product.quantity! < quantity) {
      throw new QuantityUnavailableError()
    }

    const priceSaida = product.price * quantity

    const withdrawLog = await this.stockRepository.createWithdrawStockItemLog(
      quantity,
      productId,
      setorId,
      priceSaida,
      createdIn,
      userId,
      fazenda_id,
    )

    const produtoAtualizado =
      await this.productsRepository.decrementProductQuantity(
        quantity,
        productId,
      )

    return { withdrawLog, produtoAtualizado }
  }
}
