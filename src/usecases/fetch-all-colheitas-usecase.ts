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
  initialDate: string
  endDate: string
  page: number
  perPage: number
}

export class FetchAllColheitasUseCase {
  constructor(private colheitaRepository: ColheitaRepository) {}

  async execute({
    setorId,
    initialDate,
    endDate,
    page,
    perPage,
  }: FetchAllColheitasUseCaseParams): Promise<FetchAllColheitasUseCaseResponse> {
    const { colheita, total, totalColhido } =
      await this.colheitaRepository.fetchAllColheita(
        initialDate,
        endDate,
        page,
        perPage,
        setorId,
      )

    return { colheitas: colheita, total, totalColhido }
  }
}
