import { Prisma, Product } from '@prisma/client'

export interface CreateProduct {
  name: string
  unit: string
  tipoId: string
  fazenda_id: string
}

export interface FetchAllProduct {
  products: Product[]
  total: number
  totalEstoque?: number
}

export interface ProductsRepository {
  createProduct(data: Prisma.ProductUncheckedCreateInput): Promise<Product>
  deleteProduct(productId: string, fazendaId: string): Promise<Product>
  getTotalProduct(fazendaId: string): Promise<number>
  getProductLowStock(fazendaId: string): Promise<Product[]>
  getPriceProductInStock(fazendaId: string): Promise<number>
  fetchAllProduct(
    page: number,
    perPage: number,
    fazendaId: string,
    q?: string,
    all?: boolean,
  ): Promise<FetchAllProduct>
  findProduct(id: string, fazendaId: string): Promise<Product | null>
  decrementProductQuantity(
    quantity: number,
    productId: string,
  ): Promise<Product>
  incrementProductQuantity(
    quantity: number,
    productId: string,
    fazendaId: string,
  ): Promise<Product>
}
