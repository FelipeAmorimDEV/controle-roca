import { ProductsRepository } from '@/repository/products-repository'
import { ResouceNotFoundError } from './errors/resource-not-found'
import { FertirrigacaoRepository } from '@/repository/fertirrigacao-repository'

interface DeleteFertirrigacaoUseCaseParams {
  fertirrigacaoId: string
}

export class DeleteFertirrigacaoUseCase {
  constructor(
    private fertirrigacaoRepository: FertirrigacaoRepository,
    private productRepository: ProductsRepository,
  ) {}

  async execute({
    fertirrigacaoId,
  }: DeleteFertirrigacaoUseCaseParams): Promise<null> {
    const fertirrigacao =
      await this.fertirrigacaoRepository.delete(fertirrigacaoId)
    const produtosAplicados = fertirrigacao.produtos

    if (Array.isArray(produtosAplicados)) {
      produtosAplicados.forEach(async (produtoRef) => {
        const produto = await this.productRepository.findProduct(
          produtoRef.produto_id,
        )

        if (!produto) {
          throw new ResouceNotFoundError()
        }

        await this.productRepository.incrementProductQuantity(
          produtoRef.quantidade,
          produto.id,
        )
      })
    }

    return null
  }
}
