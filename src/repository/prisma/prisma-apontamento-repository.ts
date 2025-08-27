import { Apontamento, Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { ApontamentoRepository } from '../apontamento-repository'
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
