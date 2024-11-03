/* eslint-disable no-useless-constructor */
import { QrcodePalletRepository } from '@/repository/pallet-repository'

interface DeletePalletUseCaseParams {
  palletId: string
  fazenda_id: string
}

export class DeletePalletUseCase {
  constructor(private palletRepository: QrcodePalletRepository) {}

  async execute({
    palletId,
    fazenda_id,
  }: DeletePalletUseCaseParams): Promise<null> {
    await this.palletRepository.deletePallet(palletId, fazenda_id)

    return null
  }
}
