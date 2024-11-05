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
  deleteSaida(saidaId: string, fazendaId: string): Promise<Saida>
  deleteAllEntradas(
    productId: string,
    fazendaId: string,
  ): Promise<Prisma.BatchPayload>
  deleteAllSaidas(
    productId: string,
    fazendaId: string,
  ): Promise<Prisma.BatchPayload>
  getTotalEntrada(fazendaId: string): Promise<number>
  getTotalSaida(fazendaId: string): Promise<number>
  createWithdrawStockItemLog(
    quantity: number,
    productId: string,
    stockId: string,
    priceSaida: number,
    createdIn: string,
    userId: string,
    fazendaId: string,
  ): Promise<Saida>
  createInsertStockItemLog(
    priceEntrada: number,
    quantity: number,
    productId: string,
    createdIn: string,
    price: number,
    userId: string,
    fazendaId: string,
  ): Promise<Entrada>
  fetchEntradas(
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    fazendaId: string,
    productId?: string,
  ): Promise<EntradasResult>
  fetchSaidas(
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    fazendaId: string,
    productId?: string,
    setorId?: string,
  ): Promise<SaidasResult>
}
