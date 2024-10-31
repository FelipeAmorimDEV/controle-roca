import { Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { SetorRepository } from '../setor-repository'

interface Funcionario {
  id: string
  nome: string
}

interface Atividade {
  atividadeId: string
  nomeAtividade: string
  categoria: string
  dataInicio: Date
  dataFim: Date | null
  duracao: number | null
  funcionario: Funcionario
}

export interface LoteRelatorio {
  loteId: string
  nomeLote: string
  tamanho: number
  tipoVinha: string
  atividades: Atividade[]
}

/* 
  [
	{
		"id": "1a805459-99fd-4a5a-b017-8cccbcffc6d2",
		"data_inicio": "2024-10-30T17:18:14.834Z",
		"data_fim": null,
		"status": "em andamento",
		"funcionario_id": "40d7ee68-a2a7-43b3-991f-16ab2df9eeab",
		"atividade_id": "21358b90-0a8a-4e1f-bd25-8e5f0e23883c",
		"setor_id": "0f121a99-af13-49be-8ddb-397fc902a633",
		"atividade": {
			"id": "21358b90-0a8a-4e1f-bd25-8e5f0e23883c",
			"nome": "PODA",
			"categoria": "Campo"
		},
		"funcionario": {
			"id": "40d7ee68-a2a7-43b3-991f-16ab2df9eeab",
			"nome": "LEO",
			"cargo": "Tarefa"
		}
	}
]

*/

interface Setor {
  id: string
  setorName: string
  filas: string
  variedade: string
  tamanhoArea: number
}

export interface ApontamentosI {
  id: string
  status: string
  data_inicio: Date
  data_fim: Date | null
  atividade: string
  funcionario: string
  duracao: number | null
  setor: Setor
}

export class PrismaSetorRepository implements SetorRepository {
  async fetchAllApontamentos(): Promise<ApontamentosI[]> {
    const apontamentos = await prisma.apontamento.findMany({
      include: {
        atividade: true,
        funcionario: true,
        setor: true,
      },
    })

    const relatorio = apontamentos.map((apontamento) => {
      const obj = {
        id: apontamento.id,
        status: apontamento.status,
        data_inicio: apontamento.data_inicio,
        data_fim: apontamento.data_fim,
        atividade: apontamento.atividade.nome,
        funcionario: apontamento.funcionario.nome,
        duracao: apontamento.data_fim
          ? apontamento.data_fim.getTime() - apontamento.data_inicio.getTime()
          : null,
        setor: apontamento.setor,
      }

      return obj
    })

    return relatorio
  }

  async fetchAllSetor(): Promise<Setor[]> {
    const setores = prisma.setor.findMany({
      orderBy: {
        setorName: 'asc',
      },
    })

    return setores
  }

  async createSetor(data: Prisma.SetorCreateInput) {
    const setor = prisma.setor.create({
      data,
    })

    return setor
  }
}
