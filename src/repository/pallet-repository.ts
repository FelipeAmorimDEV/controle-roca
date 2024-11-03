import { Pallets, Prisma } from '@prisma/client'
export interface FetchPallets {
  pallets: Pallets[]
  totalPallets: number
}
export interface QrcodePalletRepository {
  findPalletQrcodeById(qrcodeId: string): Promise<Pallets | null>
  fetchAllPalletQrcode(
    page: number,
    perPage: number,
    initialDate: string,
    endDate: string,
    status?: string,
    classificacaoId?: number,
    variedadeId?: number,
  ): Promise<FetchPallets>
  changeQrcodePalletUsado(qrcodeId: string): Promise<Pallets | null>
  createQrcodePallet(data: Prisma.PalletsUncheckedCreateInput): Promise<Pallets>
  deletePallet(palletId: string): Promise<Pallets>
  vincularCaixaAoPallet(palletId: string, caixaId: string): Promise<Pallets>
  incrementPalletCaixa(palletId: string): Promise<Pallets>
  finalizarPallet(palletId: string): Promise<Pallets>
}
