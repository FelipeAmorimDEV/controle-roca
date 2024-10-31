import {  Caixa, Prisma, Qrcodes } from '@prisma/client'

export interface CaixaRepository {
  fetchAllCaixa(): Promise<Caixa[]>
  createCaixa(data: Prisma.CaixaCreateInput): Promise<Caixa>
}
