import { Pallets } from '@prisma/client'
import { QrcodePalletRepository } from '@/repository/pallet-repository'

interface FetchAllPalletsUseCaseParams {
  page: number
  perPage: number
  initialDate: string
  endDate: string
  classificacaoId?: number
  variedadeId?: number
}
interface FetchAllPalletsUseCaseResponse {
  pallets: Pallets[]
  totalPallets: number
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
  }: FetchAllPalletsUseCaseParams): Promise<FetchAllPalletsUseCaseResponse> {
    const { pallets, totalPallets } =
      await this.qrcodePalletRepository.fetchAllPalletQrcode(
        page,
        perPage,
        initialDate,
        endDate,
        classificacaoId,
        variedadeId,
      )

    return { pallets, totalPallets }
  }
}
