import { NotaFiscalRepository } from '@/repository/nota-fiscal-repository'
import { ProductsRepository } from '@/repository/products-repository'
import { StockRepository } from '@/repository/stock-repository'
import { NotaFiscal } from '@prisma/client'

export interface ProdutosNotaFiscal {
  productId: string
  quantidade: number
  valor: number
}

interface CreateNotaFiscalUseCaseParams {
  dataNota: string
  dataPagamento?: string
  statusPagamento?: string
  codigoDeBarras?: string
  fornecedorId: string
  fazenda_id: string
  produtos: ProdutosNotaFiscal[]
  user_id: string
}

interface CreateNotaFiscalUseCaseResponse {
  notaFiscal: NotaFiscal
}

export class CreateNotaFiscalUseCase {
  constructor(
    private notaFiscalRepository: NotaFiscalRepository,
    private productRepository: ProductsRepository,
    private stockRepository: StockRepository,
  ) {}

  async execute({
    dataNota,
    dataPagamento,
    fazenda_id,
    produtos,
    statusPagamento,
    user_id,
    fornecedorId,
    codigoDeBarras,
  }: CreateNotaFiscalUseCaseParams): Promise<CreateNotaFiscalUseCaseResponse> {
    const notaFiscal = await this.notaFiscalRepository.create(
      {
        dataNota,
        fazenda_id,
        dataPagamento,
        statusPagamento,
        fornecedor_id: fornecedorId,
        codigo_de_barras: codigoDeBarras,
      },
      produtos,
    )

    for (let i = 0; i < produtos.length; i++) {
      const element = produtos[i]

      await this.stockRepository.createInsertStockItemLog(
        element.quantidade,
        element.valor,
        element.productId,
        new Date().toISOString().split('T')[0],
        element.valor / element.quantidade,
        user_id,
        fazenda_id,
      )

      await this.productRepository.incrementProductQuantity(
        element.quantidade,
        element.productId,
        fazenda_id,
      )
    }

    return { notaFiscal }
  }
}
