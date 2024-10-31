import { InMemoryProductRepository } from '../repository/in-memory-repository/in-memory-product-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryStockRepository } from '../repository/in-memory-repository/in-memory-stock-removal-repository'
import { IncrementStockUseCase } from './insert-stock-product-usecase'

let productsRepository: InMemoryProductRepository
let stockRepository: InMemoryStockRepository
let sut: IncrementStockUseCase

describe('Increment Product Quantity', async () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductRepository()
    stockRepository = new InMemoryStockRepository()
    sut = new IncrementStockUseCase(productsRepository, stockRepository)
  })

  it('should be able to increment a stock product', async () => {
    const { id } = await productsRepository.createProduct({
      id: crypto.randomUUID(),
      name: 'pbz',
      price: 150,
      quantity: 10,
      unit: 'kg',
    })

    const { produtoAtualizado } = await sut.execute({
      quantity: 10,
      productId: id,
    })

    expect(produtoAtualizado).toEqual(
      expect.objectContaining({
        quantity: 20,
      }),
    )
  })
})
