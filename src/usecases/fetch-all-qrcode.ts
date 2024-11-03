import { QrcodeRepository } from '@/repository/qrcode-repository'
import { Qrcodes } from '@prisma/client'

interface FetchAllQrcodeUseCaseParams {
  funcionarioId?: string
  initialDate: string
  endDate: string
  fazenda_id: string
}

interface FetchAllQrcodeUseCaseResponse {
  qrcodes: Qrcodes[]
}

export class FetchAllQrcodeUseCase {
  constructor(private qrcodeRepository: QrcodeRepository) {}

  async execute({
    funcionarioId,
    endDate,
    initialDate,
    fazenda_id,
  }: FetchAllQrcodeUseCaseParams): Promise<FetchAllQrcodeUseCaseResponse> {
    const qrcodes = await this.qrcodeRepository.fetchAllQrcode(
      initialDate,
      endDate,
      fazenda_id,
      funcionarioId,
    )

    return { qrcodes }
  }
}
