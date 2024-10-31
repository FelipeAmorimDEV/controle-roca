import { InMemoryProductRepository } from '../repository/in-memory-repository/in-memory-product-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { WithdrawStockUseCase } from './withdraw-stock-product-usecase'
import { InMemoryStockRepository } from '../repository/in-memory-repository/in-memory-stock-removal-repository'

let productsRepository: InMemoryProductRepository
let stockRepository: InMemoryStockRepository
let sut: WithdrawStockUseCase

describe('Decrement Product Quantity Use Case', async () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductRepository()
    stockRepository = new InMemoryStockRepository()
    sut = new WithdrawStockUseCase(productsRepository, stockRepository)
  })

  it('should be able to withdraw a stock product', async () => {
    const { id } = await productsRepository.createProduct({
      id: crypto.randomUUID(),
      name: 'pbz',
      price: 150,
      quantity: 10,
      unit: 'kg',
    })

    const { produtoAtualizado } = await sut.execute({
      quantity: 7,
      productId: id,
    })

    expect(produtoAtualizado).toEqual(
      expect.objectContaining({
        quantity: 3,
      }),
    )
  })
})
