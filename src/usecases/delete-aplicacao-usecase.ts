import { AplicacaoRepository } from '@/repository/aplicacao-repository'
import { ProductsRepository } from '@/repository/products-repository'
import { ResouceNotFoundError } from './errors/resource-not-found'

interface DeleteAplicacaoUseCaseParams {
  aplicacaoId: string
}

interface ProdutosAplicados {
  produto: string
  dosagem: number
  total: number
}

export class DeleteAplicacaoUseCase {
  constructor(
    private aplicacaoRepository: AplicacaoRepository,
    private productRepository: ProductsRepository,
  ) {}

  async execute({ aplicacaoId }: DeleteAplicacaoUseCaseParams): Promise<null> {
    const aplicacao = await this.aplicacaoRepository.delete(aplicacaoId)
    const produtosAplicados = aplicacao.produtosAplicados as unknown as
      | ProdutosAplicados[]
      | null

    if (Array.isArray(produtosAplicados)) {
      produtosAplicados.forEach(async (produtoRef) => {
        if (produtoRef && 'produto' in produtoRef) {
          const produto = await this.productRepository.findProduct(
            produtoRef.produto,
          )

          if (!produto) {
            throw new ResouceNotFoundError()
          }

          await this.productRepository.incrementProductQuantity(
            produtoRef.total / 1000,
            produto.id,
          )
        }
      })
    }

    return null
  }
}
