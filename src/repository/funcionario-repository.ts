import { Funcionario, Prisma } from '@prisma/client'

export interface FuncionarioRepository {
  createFuncionario(
    data: Prisma.FuncionarioUncheckedCreateInput,
  ): Promise<Funcionario>
  findFuncionarioById(
    funcionarioId: string,
    fazendaId: string,
  ): Promise<Funcionario | null>
  fetchAllFuncionarios(fazendaId: string): Promise<Funcionario[]>
  fetchAllFuncionariosWithQrcodes(
    initialDate: string,
    endDate: string,
    fazendaId: string,
    q?: string,
  ): Promise<Funcionario[]>
}
