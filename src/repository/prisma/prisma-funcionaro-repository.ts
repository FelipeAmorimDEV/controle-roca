import { Funcionario, Prisma } from '@prisma/client'
import { FuncionarioRepository } from '../funcionario-repository'
import { prisma } from '@/prisma'

export class PrismaFuncionarioRepository implements FuncionarioRepository {
  async fetchAllFuncionariosWithQrcodes(
    initialDate: string,
    endDate: string,
    q?: string,
  ): Promise<Funcionario[]> {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

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
            createdAt: {
              gte: new Date(initialDate),
              lte: new Date(endDateOfTheDay),
            },
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
