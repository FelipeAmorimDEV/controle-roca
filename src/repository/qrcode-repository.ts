import { Prisma, Qrcodes } from '@prisma/client'

export interface FuncionarioStatus {
  nome: string
  qtdCaixa: number
  pesoTotal: number
  variedade: string
  tipoCaixa: number
}

export interface IStatus {
  status: FuncionarioStatus
}

export interface QrcodeRepository {
  findQrcodeById(qrcodeId: string, fazendaId: string): Promise<Qrcodes | null>
  fetchAllQrcode(
    initialDate: string,
    endDate: string,
    fazendaId: string,
    functionarioId?: string,
  ): Promise<Qrcodes[]>
  changeQrcodeUsado(
    qrcodeId: string,
    fazendaId: string,
  ): Promise<Qrcodes | null>
  createQrcode(data: Prisma.QrcodesUncheckedCreateInput): Promise<Qrcodes>
}
