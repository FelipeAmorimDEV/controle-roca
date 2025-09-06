import {  StatusTrator } from '@prisma/client'
import { prisma } from '@/prisma'

import { CreateTrator, FetchTratores, Manutencoes, TratorRepository, UpdateHorasTrator } from '../trator-repository'

export class PrismaTratorRepository implements TratorRepository {
  async create(data: CreateTrator, manutencoes: Manutencoes[]) {
    const trator = await prisma.trator.create({
      data: {
        ...data,
        alertasManutencao: {
          create: manutencoes.map((manutencao) => (
            {
              tipo: manutencao.tipo,
              intervaloHoras: manutencao.intervaloHoras,
              proximaManutencaoHoras: manutencao.proximaManutencaoHoras,
              descricao: manutencao.descricao,
              fazenda_id: data.fazenda_id
            }
          ))
        }
      }
    })

    return trator
  }

  async findById(tratarId: string, fazenda_id: string) {
    return await prisma.trator.findFirst({
      where: {
        id: tratarId,
        fazenda_id
      },
      include: {
        alertasManutencao: { where: { ativo: true } },
        registrosHoras: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        manutencoes: {
          orderBy: { dataManutencao: 'desc' },
          take: 10
        }
      }
    })
  }

  async fetchByFazenda(fazenda_id: string): Promise<FetchTratores> {
    const tratores = await prisma.trator.findMany({
      where: { fazenda_id },
      include: {
        alertasManutencao: { where: { ativo: true } },
        registrosHoras: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        manutencoes: {
          where: { status: 'CONCLUIDA' },
          orderBy: { dataManutencao: 'desc' },
          take: 1
        }
      },
      orderBy: { nome: 'asc' }
    })

    const tratoresComAlertas = tratores.map(trator => {
      const alertasPendentes = trator.alertasManutencao
        .filter(alerta => trator.horasAtuais >= alerta.proximaManutencaoHoras)
        .map(alerta => ({
          tipo: alerta.tipo,
          descricao: alerta.descricao || '',
          horasAtuais: trator.horasAtuais,
          horasManutencao: alerta.proximaManutencaoHoras,
          horasAtraso: trator.horasAtuais - alerta.proximaManutencaoHoras,
          prioridade: trator.horasAtuais > alerta.proximaManutencaoHoras + 50 ? 'ALTA' as const : 'NORMAL' as const
        }))

      return {
        ...trator,
        alertasPendentes,
        ultimaAtualizacao: trator.registrosHoras[0]?.createdAt || null,
        ultimaManutencao: trator.manutencoes[0]?.dataManutencao || null
      }
    })

    return {
      tratores: tratoresComAlertas,
      totalTratores: tratores.length
    }
  }

  async updateHoras(data: UpdateHorasTrator) {
    await prisma.$transaction(async (tx) => {
      const trator = await tx.trator.findFirst({
        where: {
          id: data.tratarId,
          fazenda_id: data.fazenda_id
        },
        include: { alertasManutencao: true }
      })

      if (!trator) {
        throw new Error('Trator não encontrado')
      }

      if (data.horasNovas <= trator.horasAtuais) {
        throw new Error('As novas horas devem ser maiores que o horímetro atual')
      }

      // Criar registro de horas
      await tx.registroHoras.create({
        data: {
          tratarId: data.tratarId,
          horasAnteriores: trator.horasAtuais,
          horasNovas: data.horasNovas,
          descricao: data.descricao,
          operador: data.operador,
          fazenda_id: data.fazenda_id
        }
      })

      // Atualizar horímetro do trator
      await tx.trator.update({
        where: { id: data.tratarId },
        data: { horasAtuais: data.horasNovas }
      })

      // Atualizar alertas de manutenção
      for (const alerta of trator.alertasManutencao) {
        if (alerta.ativo && data.horasNovas >= alerta.proximaManutencaoHoras) {
          let proximasHoras = alerta.proximaManutencaoHoras
          while (proximasHoras <= data.horasNovas) {
            proximasHoras += alerta.intervaloHoras
          }

          await tx.alertaManutencao.update({
            where: { id: alerta.id },
            data: { proximaManutencaoHoras: proximasHoras }
          })
        }
      }
    })
  }

  async updateStatus(tratarId: string, status: StatusTrator, fazenda_id: string) {
    await prisma.trator.update({
      where: {
        id: tratarId,
        fazenda_id
      },
      data: { status }
    })
  }

}
