/* eslint-disable no-useless-constructor */
import { NotaFiscalRepository } from '@/repository/nota-fiscal-repository'
import { ProductsRepository } from '@/repository/products-repository'
import { StockRepository } from '@/repository/stock-repository'

interface DeleteNotaFiscalUseCaseParams {
  notaFiscalId: string
}

export class DeleteNotaFiscalUseCase {
  constructor(
    private notaFiscalRepository: NotaFiscalRepository,
    private stockRepository: StockRepository,
    private productRepository: ProductsRepository,
  ) {}

  async execute({
    notaFiscalId,
  }: DeleteNotaFiscalUseCaseParams): Promise<null> {
    const notaFiscal = await this.notaFiscalRepository.delete(notaFiscalId)

    const produtos = notaFiscal.produtos
    for (let i = 0; i < produtos.length; i++) {
      const element = produtos[i]

      await this.stockRepository.deleteEntrada(element.entradaId)
      await this.productRepository.decrementProductQuantity(
        element.quantidade,
        element.productId,
      )
    }

    return null
  }
}
