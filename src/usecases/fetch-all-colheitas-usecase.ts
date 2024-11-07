/* eslint-disable no-useless-constructor */
import { ColheitaRepository } from '@/repository/colheita-repository'
import { Colheita } from '@prisma/client'

interface FetchAllColheitasUseCaseResponse {
  colheitas: Colheita[]
  total: number
  totalColhido: number | null
}

interface FetchAllColheitasUseCaseParams {
  setorId?: string
  variedade?: string
  initialDate: string
  endDate: string
  page: number
  perPage: number
  fazenda_id: string
}

export class FetchAllColheitasUseCase {
  constructor(private colheitaRepository: ColheitaRepository) {}

  async execute({
    setorId,
    initialDate,
    endDate,
    page,
    perPage,
    fazenda_id,
    variedade,
  }: FetchAllColheitasUseCaseParams): Promise<FetchAllColheitasUseCaseResponse> {
    const { colheita, total, totalColhido } =
      await this.colheitaRepository.fetchAllColheita(
        initialDate,
        endDate,
        page,
        perPage,
        fazenda_id,
        setorId,
        variedade,
      )

    return { colheitas: colheita, total, totalColhido }
  }
}
