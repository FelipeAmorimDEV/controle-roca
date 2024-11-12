/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { Product } from '@prisma/client'
import * as XLSX from 'xlsx'

interface ExportaProdutoUseCaseParams {
  fazenda_id: string
}

interface ExportaProdutoUseCaseResponse {
  buffer: Buffer
}

export class ExportaProdutoUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    fazenda_id,
  }: ExportaProdutoUseCaseParams): Promise<ExportaProdutoUseCaseResponse> {
    const products = await this.productsRepository.fetchAll(fazenda_id)

    const data = products.map((product) => ({
      Nome: product.name,
      Quantidade: product.quantity,
      Valor: product.price,
      Unidade: product.unit,
    }))

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos')

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    }) as Buffer

    return { buffer }
  }
}
