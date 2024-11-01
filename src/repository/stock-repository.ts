import { Entrada, Prisma, Saida } from '@prisma/client'

export interface EntradasResult {
  entradas: Entrada[]
  total: number
  entradasTotal: number | null
}

export interface SaidasResult {
  saidas: Saida[]
  total: number
  saidasTotal: number | null
}

export interface StockRepository {
  deleteEntrada(entradaId: string): Promise<Entrada>
  deleteSaida(saidaId: string): Promise<Saida>
  deleteAllEntradas(productId: string): Promise<Prisma.BatchPayload>
  deleteAllSaidas(productId: string): Promise<Prisma.BatchPayload>
  createWithdrawStockItemLog(
    quantity: number,
    productId: string,
    stockId: string,
    priceSaida: number,
    createdIn: string,
    userId: string,
  ): Promise<Saida>
  createInsertStockItemLog(
    priceEntrada: number,
    quantity: number,
    productId: string,
    createdIn: string,
    price: number,
    userId: string,
  ): Promise<Entrada>
  fetchEntradas(
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    productId?: string,
  ): Promise<EntradasResult>
  fetchSaidas(
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    productId?: string,
    setorId?: string,
  ): Promise<SaidasResult>
}
