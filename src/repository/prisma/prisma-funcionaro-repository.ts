import { Funcionario, Prisma } from '@prisma/client'
import { FuncionarioRepository } from '../funcionario-repository'
import { prisma } from '@/prisma'

export class PrismaFuncionarioRepository implements FuncionarioRepository {
  async fetchAllFuncionariosWithQrcodes(q?: string): Promise<Funcionario[]> {
    const funcionarios = await prisma.funcionario.findMany({
      where: {
        nome: {
          contains: q,
          mode: 'insensitive',
        },
      },
      include: {
        Qrcodes: {
          where: {
            usado: true,
          },
        },
      },
    })

    return funcionarios
  }

  async fetchAllFuncionarios(): Promise<Funcionario[]> {
    const funcionarios = await prisma.funcionario.findMany()

    return funcionarios
  }

  async findFuncionarioById(
    funcionarioId: string,
  ): Promise<Funcionario | null> {
    const funcionario = await prisma.funcionario.findUnique({
      where: {
        id: funcionarioId,
      },
    })

    return funcionario
  }

  async createFuncionario(
    data: Prisma.FuncionarioCreateInput,
  ): Promise<Funcionario> {
    const funcionario = await prisma.funcionario.create({
      data,
    })

    return funcionario
  }
}
