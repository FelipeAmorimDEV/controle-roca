import { Manutencoes, TratorRepository } from '@/repository/trator-repository'
import { Trator } from '@prisma/client'

interface CreateTratorUseCaseParams {
  nome: string
  marca: string
  modelo: string
  ano: number
  numeroSerie: string
  horasAtuais: number
  dataCompra: Date
  fazenda_id: string
  manutencoes: Manutencoes[]
}

export class CreateTratorUseCase {
  constructor(private tratorRepository: TratorRepository) {}

  async execute({ano, dataCompra, fazenda_id,horasAtuais,manutencoes,marca,modelo,nome,numeroSerie}: CreateTratorUseCaseParams): Promise<Trator> {
    return await this.tratorRepository.create({ano, dataCompra, fazenda_id,horasAtuais,marca,modelo,nome,numeroSerie}, manutencoes)
  }
}