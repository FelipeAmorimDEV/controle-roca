import { Pallets } from '@prisma/client'
import { QrcodePalletRepository } from '@/repository/pallet-repository'

interface FetchAllPalletsUseCaseParams {
  page: number
  perPage: number
  initialDate: string
  endDate: string
  classificacaoId?: number
  variedadeId?: number
  status?: string
  fazenda_id: string
}
interface FetchAllPalletsUseCaseResponse {
  pallets: Pallets[]
  totalPallets: number
  totalColhido: number
}

export class FetchAllPalletsUseCase {
  constructor(private qrcodePalletRepository: QrcodePalletRepository) {}

  async execute({
    page,
    perPage,
    endDate,
    initialDate,
    classificacaoId,
    variedadeId,
    status,
    fazenda_id,
  }: FetchAllPalletsUseCaseParams): Promise<FetchAllPalletsUseCaseResponse> {
    const { pallets, totalPallets, totalColhido } =
      await this.qrcodePalletRepository.fetchAllPalletQrcode(
        page,
        perPage,
        initialDate,
        endDate,
        fazenda_id,
        status,
        classificacaoId,
        variedadeId,
      )

    return { pallets, totalPallets, totalColhido }
  }
}
