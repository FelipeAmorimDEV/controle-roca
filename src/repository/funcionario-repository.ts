import { Funcionario, Prisma } from '@prisma/client'

export interface FuncionarioRepository {
  createFuncionario(data: Prisma.FuncionarioCreateInput): Promise<Funcionario>
  findFuncionarioById(funcionarioId: string): Promise<Funcionario | null>
  fetchAllFuncionarios(): Promise<Funcionario[]>
  fetchAllFuncionariosWithQrcodes(q?: string): Promise<Funcionario[]>
}
