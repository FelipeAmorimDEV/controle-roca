import { Apontamento, Funcionario, Prisma } from '@prisma/client'

export interface CaixasEmbaladas {
  nome: string
  caixasEmbaladas: number
}
export interface FuncionarioComApontamentos extends Funcionario {
  Apontamento: Apontamento[]
}

export interface FuncionarioRepository {
  createFuncionario(
    data: Prisma.FuncionarioUncheckedCreateInput,
  ): Promise<Funcionario>
  findFuncionarioById(
    funcionarioId: string,
    fazendaId: string,
  ): Promise<Funcionario | null>
  fetchAllFuncionarios(fazendaId: string): Promise<FuncionarioComApontamentos[]>
  fetchAllFuncionariosWithQrcodes(
    initialDate: string,
    endDate: string,
    fazendaId: string,
    q?: string,
  ): Promise<CaixasEmbaladas[]>
}
