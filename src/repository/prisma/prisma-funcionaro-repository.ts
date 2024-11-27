import { Funcionario, Prisma } from '@prisma/client'
import {
  FuncionarioComApontamentos,
  FuncionarioRepository,
} from '../funcionario-repository'
import { prisma } from '@/prisma'

export class PrismaFuncionarioRepository implements FuncionarioRepository {
  async fetchAllFuncionariosWithQrcodes(
    initialDate: string,
    endDate: string,
    fazendaId: string,
    q?: string,
  ) {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const relatorio = await prisma.funcionario.findMany({
      where: {
        fazenda_id: fazendaId,
        nome: {
          contains: q,
        },
        cargo: 'EMBALADOR',
      },
      select: {
        nome: true,
        _count: {
          select: {
            Qrcodes: {
              where: {
                validated_at: {
                  gte: new Date(initialDate),
                  lte: new Date(endDateOfTheDay),
                },
              },
            },
          },
        },
      },
      orderBy: {
        Qrcodes: {
          _count: 'desc',
        },
      },
    })

    const relatorioQrcodes = relatorio
      .map((funcionario) => ({
        nome: funcionario.nome,
        caixasEmbaladas: funcionario._count.Qrcodes,
      }))
      .sort((a, b) => b.caixasEmbaladas - a.caixasEmbaladas)

    return relatorioQrcodes
  }

  async fetchAllFuncionarios(
    fazendaId: string,
  ): Promise<FuncionarioComApontamentos[]> {
    const funcionarios = await prisma.funcionario.findMany({
      where: {
        fazenda_id: fazendaId,
      },
      include: {
        Apontamento: {
          where: {
            status: 'concluida',
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    })

    return funcionarios
  }

  async findFuncionarioById(
    funcionarioId: string,
    fazendaId: string,
  ): Promise<Funcionario | null> {
    const funcionario = await prisma.funcionario.findUnique({
      where: {
        id: funcionarioId,
        fazenda_id: fazendaId,
      },
    })

    return funcionario
  }

  async createFuncionario(
    data: Prisma.FuncionarioUncheckedCreateInput,
  ): Promise<Funcionario> {
    const funcionario = await prisma.funcionario.create({
      data,
    })

    return funcionario
  }
}
