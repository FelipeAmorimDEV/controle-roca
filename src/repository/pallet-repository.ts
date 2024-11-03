import { Pallets, Prisma } from '@prisma/client'
export interface FetchPallets {
  pallets: Pallets[]
  totalPallets: number
}
export interface QrcodePalletRepository {
  findPalletQrcodeById(
    qrcodeId: string,
    fazendaId: string,
  ): Promise<Pallets | null>
  fetchAllPalletQrcode(
    page: number,
    perPage: number,
    initialDate: string,
    endDate: string,
    fazendaId: string,
    status?: string,
    classificacaoId?: number,
    variedadeId?: number,
  ): Promise<FetchPallets>
  changeQrcodePalletUsado(
    qrcodeId: string,
    fazendaId: string,
  ): Promise<Pallets | null>
  createQrcodePallet(data: Prisma.PalletsUncheckedCreateInput): Promise<Pallets>
  deletePallet(palletId: string, fazendaId: string): Promise<Pallets>
  vincularCaixaAoPallet(
    palletId: string,
    caixaId: string,
    fazendaId: string,
  ): Promise<Pallets>
  incrementPalletCaixa(palletId: string, fazendaId: string): Promise<Pallets>
  finalizarPallet(palletId: string, fazendaId: string): Promise<Pallets>
}
