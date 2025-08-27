import { Apontamento, Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { ApontamentoRepository, AtividadeExtraDTO, FiltrosMetasExcedidasDTO, FuncionarioMetasExcedidasDTO, PeriodoDTO, StatsMetasExcedidasDTO } from '../apontamento-repository'
import dayjs from 'dayjs'

export interface CardsSuperioresResponseDTO {
  atividadesHoje: number;
  trabalhadoresAtivos: number;
  valorMensal: number;
  custoTotal: number;
}


export interface FuncionarioAtividade {
  nome: string;
  meta: number;           // apontamento.meta || 0
  qtdTarefa: number;      // apontamento.qtd_tarefa || 0  
  custoTarefa: number;    // apontamento.custo_tarefa || 0
  valorExtra: number
}

// Tipagem para uma atividade agrupada (item do array de retorno)
export interface AtividadeAgrupada {
  nomeAtividade: string;      // apontamento.atividade.nome
  categoria: string;          // apontamento.atividade.categoria
  setor: string;             // apontamento.setor.setorName
  data: Date;                // apontamento.data_inicio (do primeiro do grupo)
  funcionarios: FuncionarioAtividade[];  // array com todos os funcionários
  custoTotal: number;        // soma de todos os custoTarefa
}

// Tipagem do retorno completo da função
export type AtividadesRecentesResult = AtividadeAgrupada[];

// ========== TIPAGEM DETALHADA DOS DADOS DO PRISMA ==========

// Tipagem do que vem do Prisma (antes do agrupamento)
export interface ApontamentoPrisma {
  id: string;
  data_inicio: Date;
  data_fim: Date | null;
  status: string;
  meta: number | null;
  qtd_tarefa: number | null;
  custo_tarefa: number | null;
  valor_bonus: number;
  duracao_horas: number | null;
  tipo_apontamento: string;
  funcionario_id: string;
  atividade_id: string;
  setor_id: string;
  fazenda_id: string;
  // Dados incluídos via include
  funcionario: {
    nome: string;
  };
  atividade: {
    nome: string;
    categoria: string;
  };
  setor: {
    setorName: string;
  };
}

// Tipagem do array que vem do Prisma
export type ApontamentosPrismaResult = ApontamentoPrisma[];

// ========== TIPAGEM DO PROCESSO DE AGRUPAMENTO ==========

// Tipagem do acumulador durante o reduce
export interface AtividadeAcumulador {
  [chave: string]: {
    nomeAtividade: string;
    categoria: string;
    setor: string;
    data: Date;
    funcionarios: FuncionarioAtividade[];
    custoTotal: number;
  };
}

export class PrismaApontamentoRepository implements ApontamentoRepository {

  private calcularExtras(apontamento: any): number {
    if (apontamento.tipo_apontamento === 'meta' && 
        apontamento.meta && 
        apontamento.qtd_tarefa) {
      const extras = apontamento.qtd_tarefa - apontamento.meta
      return extras > 0 ? extras : 0
    }
    return 0
  }

  private generateAvatar(nome: string): string {
    return nome.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  // =============================================
  // FUNÇÃO AUXILIAR PARA PERÍODOS (ESTÁTICA)
  // =============================================

  static getPeriodoDates(periodo: 'semana' | 'mes' | 'quinzena'): PeriodoDTO {
    const agora = new Date()
    const inicio = new Date()
    const fim = new Date()

    switch (periodo) {
      case 'semana':
        const diaSemana = agora.getDay()
        inicio.setDate(agora.getDate() - diaSemana)
        fim.setDate(agora.getDate() + (6 - diaSemana))
        break
      case 'quinzena':
        inicio.setDate(agora.getDate() - 15)
        break
      case 'mes':
        inicio.setDate(1)
        fim.setMonth(agora.getMonth() + 1, 0)
        break
    }

    inicio.setHours(0, 0, 0, 0)
    fim.setHours(23, 59, 59, 999)

    return { inicio, fim }
  }




async getFuncionariosMetasExcedidas(
  fazendaId: string,
  dataInicio: Date,
  dataFim: Date
): Promise<FuncionarioMetasExcedidasDTO[]> {
  try {
    // Primeiro, busca todos os apontamentos no período
    const apontamentos = await prisma.apontamento.findMany({
      where: {
        fazenda_id: fazendaId,
        data_inicio: {
          gte: dataInicio,
          lte: dataFim,
        },
        tipo_apontamento: 'meta',
        status: 'concluida',
        // Garantir que tem meta e qtd_tarefa válidas
        meta: {
          not: null,
          gt: 0
        },
        qtd_tarefa: {
          not: null,
          gt: 0
        }
      },
      include: {
        funcionario: true,
        atividade: true,
        setor: true,
      },
      orderBy: {
        data_inicio: 'desc',
      },
    });

    // Filtra apenas apontamentos onde qtd_tarefa > meta
    const apontamentosComExtras = apontamentos.filter(apontamento => {
      const meta = apontamento.meta || 0;
      const realizado = apontamento.qtd_tarefa || 0;
      return realizado > meta && apontamento.funcionario.ativo;
    });

    // Agrupa por funcionário
    const funcionariosMap = new Map<string, {
      funcionario: any,
      apontamentos: any[]
    }>();

    apontamentosComExtras.forEach(apontamento => {
      const funcionarioId = apontamento.funcionario.id;
      
      if (!funcionariosMap.has(funcionarioId)) {
        funcionariosMap.set(funcionarioId, {
          funcionario: apontamento.funcionario,
          apontamentos: []
        });
      }
      
      funcionariosMap.get(funcionarioId)!.apontamentos.push(apontamento);
    });

    // Transforma em DTO
    const resultado: FuncionarioMetasExcedidasDTO[] = Array.from(funcionariosMap.values()).map(({ funcionario, apontamentos }) => {
      const activities: AtividadeExtraDTO[] = apontamentos.map((apontamento): AtividadeExtraDTO => {
        const meta = apontamento.meta || 0;
        const realizado = apontamento.qtd_tarefa || 0;
        const extras = Math.max(0, realizado - meta);
        const valorUnitario = apontamento.valor_bonus || 0;

        return {
          id: apontamento.id,
          name: apontamento.atividade.nome,
          date: apontamento.data_inicio.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          }),
          meta,
          realizado,
          extras,
          valorUnitario,
          setor: apontamento.setor.setorName,
          status: apontamento.status,
        };
      });

      const totalExtras = activities.reduce((sum, activity) => sum + activity.extras, 0);
      const totalValue = activities.reduce(
        (sum, activity) => sum + activity.valorUnitario, 
        0
      );

      return {
        id: funcionario.id,
        name: funcionario.nome,
        role: funcionario.cargo,
        avatar: this.generateAvatar(funcionario.nome),
        totalExtras,
        totalValue,
        activities,
      };
    });

    return resultado;
    
  } catch (error) {
    console.error('Erro detalhado:', error);
    throw new Error(`Erro ao buscar funcionários com metas excedidas: ${error}`);
  }
}

  async getStatsMetasExcedidas(
    fazendaId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<StatsMetasExcedidasDTO> {
    try {
      const apontamentos = await prisma.apontamento.findMany({
        where: {
          fazenda_id: fazendaId,
          data_inicio: {
            gte: dataInicio,
            lte: dataFim,
          },
          tipo_apontamento: 'meta',
          status: 'concluida',
        },
        include: {
          atividade: true,
          funcionario: true,
        },
      })

      const apontamentosComExtras = apontamentos.filter(ap => this.calcularExtras(ap) > 0)
      
      const totalExtras = apontamentosComExtras.length

      const valorTotalExtra = apontamentosComExtras.reduce(
        (sum, ap) => sum + ap.valor_bonus, 
        0
      )

      const funcionariosUnicos = new Set(
        apontamentosComExtras.map(ap => ap.funcionario_id)
      )

      const atividadesUnicas = new Set(
        apontamentosComExtras.map(ap => ap.atividade.nome)
      )

      return {
        totalExtras,
        funcionariosAtivos: funcionariosUnicos.size,
        valorTotalExtra,
        atividadesDiferentes: atividadesUnicas.size,
        atividadesNomes: Array.from(atividadesUnicas),
      }
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas de metas excedidas: ${error}`)
    }
  }

  async getFuncionariosMetasExcedidasFiltrado(
    fazendaId: string,
    dataInicio: Date,
    dataFim: Date,
    filtros: FiltrosMetasExcedidasDTO
  ): Promise<FuncionarioMetasExcedidasDTO[]> {
    try {
      const whereCondition: any = {
        fazenda_id: fazendaId,
        ativo: true,
      }

      if (filtros.funcionarioNome) {
        whereCondition.nome = {
          contains: filtros.funcionarioNome,
          mode: 'insensitive',
        }
      }

      const apontamentoWhere: any = {
        data_inicio: {
          gte: dataInicio,
          lte: dataFim,
        },
        tipo_apontamento: 'meta',
        status: 'finalizado',
      }

      if (filtros.atividadeNome) {
        apontamentoWhere.atividade = {
          nome: {
            contains: filtros.atividadeNome,
            mode: 'insensitive',
          },
        }
      }

      if (filtros.setorId) {
        apontamentoWhere.setor_id = filtros.setorId
      }

      whereCondition.Apontamento = {
        some: apontamentoWhere,
      }

      const funcionarios = await prisma.funcionario.findMany({
        where: whereCondition,
        include: {
          Apontamento: {
            where: apontamentoWhere,
            include: {
              atividade: true,
              setor: true,
            },
            orderBy: {
              data_inicio: 'desc',
            },
          },
        },
      })

      return funcionarios.map((funcionario): FuncionarioMetasExcedidasDTO => {
        const activities: AtividadeExtraDTO[] = funcionario.Apontamento
          .filter(apontamento => this.calcularExtras(apontamento) > 0)
          .map((apontamento): AtividadeExtraDTO => {
            const extras = this.calcularExtras(apontamento)
            const valorUnitario = apontamento.valor_bonus || 0

            return {
              id: apontamento.id,
              name: apontamento.atividade.nome,
              date: apontamento.data_inicio.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
              }),
              meta: apontamento.meta || 0,
              realizado: apontamento.qtd_tarefa || 0,
              extras,
              valorUnitario,
              setor: apontamento.setor.setorName,
              status: apontamento.status,
            }
          })

        const totalExtras = activities.reduce((sum, activity) => sum + activity.extras, 0)
        const totalValue = activities.reduce(
          (sum, activity) => sum + (activity.extras * activity.valorUnitario), 
          0
        )

        return {
          id: funcionario.id,
          name: funcionario.nome,
          role: funcionario.cargo,
          avatar: this.generateAvatar(funcionario.nome),
          totalExtras,
          totalValue,
          activities,
        }
      }).filter(funcionario => funcionario.totalExtras > 0)
    } catch (error) {
      throw new Error(`Erro ao buscar funcionários filtrados: ${error}`)
    }
  }

  async getAtividadesRecentes(fazenda_id: string): Promise<AtividadesRecentesResult> {
     const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

  const apontamentos = await prisma.apontamento.findMany({
    where: {
      fazenda_id,
      data_inicio: {
        gte: seteDiasAtras
      }
    },
    include: {
      funcionario: {
        select: {
          nome: true
        }
      },
      atividade: {
        select: {
          nome: true,
          categoria: true
        }
      },
      setor: {
        select: {
          setorName: true
        }
      }
    },
    orderBy: {
      data_inicio: 'desc'
    }
  });

  // Agrupar por atividade para exibir igual à sua UI
  const atividadesAgrupadas = apontamentos.reduce((acc: AtividadeAcumulador, apontamento) => {
    const chave = `${apontamento.atividade.nome}_${apontamento.setor.setorName}_${apontamento.data_inicio.toDateString()}`;
    
    if (!acc[chave]) {
      acc[chave] = {
        nomeAtividade: apontamento.atividade.nome,
        categoria: apontamento.atividade.categoria,
        setor: apontamento.setor.setorName,
        data: apontamento.data_inicio,
        funcionarios: [],
        custoTotal: 0
      };
    }

    acc[chave].funcionarios.push({
      nome: apontamento.funcionario.nome,
      meta: apontamento.meta || 0,
      qtdTarefa: apontamento.qtd_tarefa || 0,
      custoTarefa: apontamento.custo_tarefa || 0,  // já inclui tudo
      valorExtra: apontamento.valor_bonus || 0     // só para mostrar o extra
    });

    acc[chave].custoTotal += apontamento.custo_tarefa || 0;  // só soma custo_tarefa

    return acc;
  }, {});

  return Object.values(atividadesAgrupadas);
  }

  async getCardsSuperiores(fazenda_id: string): Promise<CardsSuperioresResponseDTO> {
    const hoje = new Date();
    const inicioHoje = new Date(hoje.setHours(0, 0, 0, 0));
    const fimHoje = new Date(hoje.setHours(23, 59, 59, 999));
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    // Atividades Hoje
    const atividadesHoje = await prisma.apontamento.count({
      where: {
        fazenda_id,
        data_inicio: {
          gte: inicioHoje,
          lte: fimHoje
        }
      }
    });

    // Trabalhadores Ativos
    const trabalhadoresAtivos = await prisma.apontamento.findMany({
      where: {
        fazenda_id,
        status: 'em andamento'
      },
      distinct: ['funcionario_id']
    });

    // Valor Mensal (soma dos bônus)
    const valorMensal = await prisma.apontamento.aggregate({
      where: {
        fazenda_id,
        data_inicio: {
          gte: inicioMes,
          lte: fimMes
        }
      },
      _sum: {
        valor_bonus: true
      }
    });

    // Custo Total (soma custo_tarefa + valor_bonus)
    const custoTotal = await prisma.apontamento.aggregate({
      where: {
        fazenda_id,
        data_inicio: {
          gte: inicioMes,
          lte: fimMes
        }
      },
      _sum: {
        custo_tarefa: true,
        valor_bonus: true
      }
    });

    return {
      atividadesHoje,
      trabalhadoresAtivos: trabalhadoresAtivos.length,
      valorMensal: valorMensal._sum.valor_bonus || 0,
      custoTotal: (custoTotal._sum.custo_tarefa || 0) + (custoTotal._sum.valor_bonus || 0)
    };
  }


  async findOnSameDateById(funcionarioId: string, date: Date) {
    const startOfDay = dayjs(date).startOf('date').toDate()
    const endOfDay = dayjs(date).endOf('date').toDate()

    const apontamento = await prisma.apontamento.findFirst({
      where: {
        funcionario_id: funcionarioId,
        data_inicio: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    return apontamento
  }

  async findById(apontamentoId: string): Promise<Apontamento | null> {
    const apontamento = await prisma.apontamento.findUnique({
      where: {
        id: apontamentoId,
      },
    })

    return apontamento
  }

  async deleteApontamento(
    apontamentoId: string,
    fazendaId: string,
  ): Promise<Apontamento> {
    const apontamento = await prisma.apontamento.delete({
      where: {
        id: apontamentoId,
        fazenda_id: fazendaId,
      },
    })

    return apontamento
  }

  async concluirApontamento(
    apontamentoId: string,
    fazendaId: string,
    dataConclusao: string,
    qtdAtividade: number,
    custoTarefa: number,
    duracao: number,
    valorBonus: number,
  ): Promise<Apontamento> {
    const apontamento = await prisma.apontamento.update({
      where: {
        id: apontamentoId,
        fazenda_id: fazendaId,
      },
      data: {
        data_fim: new Date(dataConclusao),
        status: 'concluida',
        qtd_tarefa: qtdAtividade,
        custo_tarefa: custoTarefa,
        duracao_horas: duracao,
        valor_bonus: valorBonus,
      },
    })

    return apontamento
  }

  async createApontamento(
    data: Prisma.ApontamentoUncheckedCreateInput,
  ): Promise<Apontamento> {
    const apontamento = await prisma.apontamento.create({
      data,
    })

    return apontamento
  }
}
