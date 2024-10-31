import { Prisma, Tratorista } from '@prisma/client'

export interface TratoristaRepository {
  createTratorista(data: Prisma.TratoristaCreateInput): Promise<Tratorista>
  fetchAllTratorista(): Promise<Tratorista[]>
}
