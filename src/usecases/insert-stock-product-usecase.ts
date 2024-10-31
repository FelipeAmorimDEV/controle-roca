/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { Entrada, Product } from '@prisma/client'
import { QuantityInvalidError } from './errors/quantity-invalid'
import { StockRepository } from '@/repository/stock-repository'
import { ResouceNotFoundError } from './errors/resource-not-found'

interface InsertStockProductUseCaseParams {
  productId: string
  quantity: number
  createdIn: string
  valorUnidade: number
  userId: string
}

interface InsertStockProductUseCaseResponse {
  withdrawLog: Entrada
  produtoAtualizado: Product
}

export class IncrementStockUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private stockRepository: StockRepository,
  ) {}

  async execute({
    quantity,
    productId,
    createdIn,
    valorUnidade,
    userId,
  }: InsertStockProductUseCaseParams): Promise<InsertStockProductUseCaseResponse> {
    const isNotValidQuantity = quantity <= 0

    if (isNotValidQuantity) {
      throw new QuantityInvalidError('Quantity') // Testar
    }

    const product = await this.productsRepository.findProduct(productId)

    if (!product) {
      throw new ResouceNotFoundError()
    }

    const priceEntrada = valorUnidade * quantity

    const withdrawLog = await this.stockRepository.createInsertStockItemLog(
      quantity,
      priceEntrada,
      productId,
      createdIn,
      valorUnidade,
      userId,
    )

    const produtoAtualizado =
      await this.productsRepository.incrementProductQuantity(
        quantity,
        productId,
      )

    return { withdrawLog, produtoAtualizado }
  }
}
