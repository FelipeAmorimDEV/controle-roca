import { Entrada, Saida } from '@prisma/client'
import { StockRepository } from '../stock-repository'

export class InMemoryStockRepository implements StockRepository {
  public stockLog: Saida[] = []

  async createInsertStockItemLog(quantity: number): Promise<Entrada> {
    const insertItemStock = {
      id: crypto.randomUUID(),
      quantity,
      createdAt: new Date(),
      productId: crypto.randomUUID(),
    }

    this.stockLog.push(insertItemStock)

    return insertItemStock
  }

  async createWithdrawStockItemLog(quantity: number) {
    const removalItemStock = {
      id: crypto.randomUUID(),
      quantity,
      createdAt: new Date(),
      productId: crypto.randomUUID(),
    }

    this.stockLog.push(removalItemStock)

    return removalItemStock
  }
}
