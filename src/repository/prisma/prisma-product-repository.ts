import { Product } from '@prisma/client'
import {
  CreateProduct,
  FetchAllProduct,
  ProductsRepository,
} from '../products-repository'
import { prisma } from '@/prisma'

export class PrismaProductRepository implements ProductsRepository {
  async getProductLowStock(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        quantity: {
          lte: 5,
        },
      },
      include: {
        Fornecedor: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
    })

    return products
  }

  async getPriceProductInStock(): Promise<number> {
    const products = await prisma.product.findMany({
      select: {
        quantity: true,
        price: true,
      },
    })

    const totalValue = products.reduce((sum, product) => {
      return sum + (product.quantity ?? 0) * product.price
    }, 0)

    return totalValue
  }

  async getTotalProduct(): Promise<number> {
    const totalProduto = await prisma.product.findMany()

    return totalProduto.length
  }

  async deleteProduct(productId: string): Promise<Product> {
    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    })

    return product
  }

  async createProduct(data: CreateProduct): Promise<Product> {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        tipoId: data.tipoId,
        fornecedorId: data.fornecedorId,
        unit: data.unit,
      },
    })

    return product
  }

  async fetchAllProduct(
    page: number,
    perPage: number,
    q?: string,
    all?: boolean,
  ): Promise<FetchAllProduct> {
    if (all) {
      const products = await prisma.product.findMany()

      return { products, total: products.length }
    }

    const produtos = await prisma.product.findMany({
      select: {
        quantity: true,
        price: true,
      },
    })

    // Calcular o valor total do estoque (preço * quantidade)
    const totalStockValue = produtos.reduce((total, produto) => {
      const price = produto.price ?? 0 // Se 'price' for null, substitui por 0
      const quantity = produto.quantity ?? 0 // Também pode tratar 'quantity' se for null
      return total + price * quantity
    }, 0) // 0 é o valor inicial do acumulador

    const totalProduto = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive',
        },
      },
    })

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return {
      products,
      total: totalProduto.length,
      totalEstoque: totalStockValue,
    }
  }

  async findProduct(id: string): Promise<Product | null> {
    const product = await prisma.product.findFirst({
      where: {
        id,
      },
    })

    return product
  }

  async decrementProductQuantity(
    quantity: number,
    productId: string,
  ): Promise<Product> {
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    })

    return product
  }

  async incrementProductQuantity(
    quantity: number,
    productId: string,
  ): Promise<Product> {
    const entradas = await prisma.entrada.findMany({
      where: {
        productId,
      },
    })

    const somaEntradas = entradas.reduce((acc, item) => {
      return acc + item.priceEntrada
    }, 0)

    const somaQuantidades = entradas.reduce((acc, item) => {
      return acc + item.quantity
    }, 0)

    const mediaPreco = somaEntradas / somaQuantidades

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        quantity: {
          increment: quantity,
        },
        price: mediaPreco,
      },
    })

    return product
  }
}
