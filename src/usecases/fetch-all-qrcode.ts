import { QrcodeRepository } from '@/repository/qrcode-repository'
import { Qrcodes } from '@prisma/client'

interface FetchAllQrcodeUseCaseParams {
  funcionarioId?: string
}

interface FetchAllQrcodeUseCaseResponse {
  qrcodes: Qrcodes[]
}

export class FetchAllQrcodeUseCase {
  constructor(private qrcodeRepository: QrcodeRepository) {}

  async execute({
    funcionarioId,
  }: FetchAllQrcodeUseCaseParams): Promise<FetchAllQrcodeUseCaseResponse> {
    const qrcodes = await this.qrcodeRepository.fetchAllQrcode(funcionarioId)

    return { qrcodes }
  }
}
