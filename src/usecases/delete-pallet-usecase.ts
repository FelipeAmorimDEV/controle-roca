/* eslint-disable no-useless-constructor */
import { QrcodePalletRepository } from '@/repository/pallet-repository'

interface DeletePalletUseCaseParams {
  palletId: string
}

export class DeletePalletUseCase {
  constructor(private palletRepository: QrcodePalletRepository) {}

  async execute({ palletId }: DeletePalletUseCaseParams): Promise<null> {
    await this.palletRepository.deletePallet(palletId)

    return null
  }
}
