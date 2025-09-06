import { Trator, StatusTrator } from '@prisma/client'

export interface CreateTrator {
  nome: string
  marca: string
  modelo: string
  ano: number
  numeroSerie: string
  horasAtuais: number
  dataCompra: Date
  fazenda_id: string
}

export interface UpdateHorasTrator {
  tratarId: string
  horasNovas: number
  descricao?: string
  operador: string
  fazenda_id: string
}

export interface FetchTratores {
  tratores: (Trator & {
    alertasPendentes: AlertaPendente[]
    ultimaAtualizacao?: Date
    ultimaManutencao?: Date
  })[]
  totalTratores: number
}

export interface AlertaPendente {
  tipo: string
  descricao: string
  horasAtuais: number
  horasManutencao: number
  horasAtraso: number
  prioridade: 'ALTA' | 'NORMAL'
}

export interface Manutencoes {
  tipo: 'CORRETIVA' | 'FILTROS' | 'OUTROS' | 'PREVENTIVA' | 'TROCA_OLEO'
  intervaloHoras: number
  proximaManutencaoHoras: number
  descricao: string
}

export interface TratorRepository {
  create(data: CreateTrator, manutencoes: Manutencoes[]): Promise<Trator>
  findById(tratarId: string, fazenda_id: string): Promise<Trator | null>
  fetchByFazenda(fazenda_id: string): Promise<FetchTratores>
  updateHoras(data: UpdateHorasTrator): Promise<void>
  updateStatus(tratarId: string, status: StatusTrator, fazenda_id: string): Promise<void>
}