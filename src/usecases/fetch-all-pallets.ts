import { Pallets } from '@prisma/client'
import { QrcodePalletRepository } from '@/repository/pallet-repository'

interface FetchAllPalletsUseCaseParams {
  page: number
  perPage: number
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
  }: FetchAllPalletsUseCaseParams): Promise<FetchAllPalletsUseCaseResponse> {
    const { pallets, totalPallets } =
      await this.qrcodePalletRepository.fetchAllPalletQrcode(page, perPage)

    return { pallets, totalPallets }
  }
}
