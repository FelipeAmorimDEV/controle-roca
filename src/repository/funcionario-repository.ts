import { ListaBonus } from '@/usecases/fetch-valor-bonus-colaborador'
import { Apontamento, Funcionario, Prisma } from '@prisma/client'

export interface CaixasEmbaladas {
  nome: string
  caixasEmbaladas: number
}
export interface FuncionarioComApontamentos extends Funcionario {
  Apontamento: Apontamento[]
}

export interface FuncionarioRepository {
  desativarFuncionario(funcionarioId: string): Promise<void>
  updateFuncionario(funcionarioId: string, cargo: string, tipoContratacao: string): Promise<void>
  createFuncionario(
    data: Prisma.FuncionarioUncheckedCreateInput,
  ): Promise<Funcionario>
  findFuncionarioById(
    funcionarioId: string,
    fazendaId: string,
  ): Promise<Funcionario | null>
  fetchAllFuncionarios(fazendaId: string): Promise<FuncionarioComApontamentos[]>
  fetchAllValorBonusByFuncionario(
    fazendaId: string,
    startDate: string,
    endDate: string,
  ): Promise<ListaBonus[]>
  fetchAllFuncionariosWithQrcodes(
    initialDate: string,
    endDate: string,
    fazendaId: string,
    q?: string,
  ): Promise<CaixasEmbaladas[]>
}
