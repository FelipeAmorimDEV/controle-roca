import { rentabilidadeSchemas } from './rentabilidade-schemas'

export const schemas = {
  // Usuário
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      user: { type: 'string' },
      nome: { type: 'string' },
      role: { type: 'string', enum: ['admin', 'encarregado', 'operador'] },
      fazenda_id: { type: 'string', format: 'uuid' },
      fazenda_nome: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  // Fazenda
  Fazenda: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  // Produto
  Product: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      unit: { type: 'string', enum: ['l', 'kg', 'ud'] },
      price: { type: 'number' },
      quantity: { type: 'number' },
      tipoId: { type: 'string', format: 'uuid' },
      fornecedorId: { type: 'string', format: 'uuid' },
      fazenda_id: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  // Funcionário
  Funcionario: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string' },
      cargo: { type: 'string' },
      tipo_contratacao: { type: 'string', enum: ['fichado', 'terceirizado'] },
      ativo: { type: 'boolean' },
      fazenda_id: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  // Setor
  Setor: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      setorName: { type: 'string' },
      variedade_id: { type: 'integer' },
      filas: { type: 'string' },
      tamanhoArea: { type: 'number' },
      dataPoda: { type: 'string', format: 'date-time' },
      fazenda_id: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  // Colheita
  Colheita: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      pesoCaixa: { type: 'integer' },
      pesoTotal: { type: 'integer' },
      qntCaixa: { type: 'integer' },
      tipoCaixa: { type: 'integer' },
      variedade: { type: 'string' },
      setorId: { type: 'string', format: 'uuid' },
      fazenda_id: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  // Trator
  Trator: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string' },
      marca: { type: 'string' },
      modelo: { type: 'string' },
      ano: { type: 'integer' },
      numeroSerie: { type: 'string' },
      horasAtuais: { type: 'number' },
      dataCompra: { type: 'string', format: 'date' },
      status: { type: 'string', enum: ['ATIVO', 'MANUTENCAO', 'INATIVO'] },
      fazenda_id: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  // Apontamento
  Apontamento: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      data_inicio: { type: 'string', format: 'date-time' },
      data_fim: { type: 'string', format: 'date-time' },
      status: { type: 'string', enum: ['em andamento', 'concluido', 'cancelado'] },
      meta: { type: 'integer' },
      qtd_tarefa: { type: 'integer' },
      custo_tarefa: { type: 'number' },
      valor_bonus: { type: 'number' },
      duracao_horas: { type: 'number' },
      tipo_apontamento: { type: 'string', enum: ['meta', 'horas'] },
      funcionario_id: { type: 'string', format: 'uuid' },
      atividade_id: { type: 'string', format: 'uuid' },
      setor_id: { type: 'string', format: 'uuid' },
      fazenda_id: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  // Aplicação
  Aplicacao: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      aplicador: { type: 'string' },
      volumeCalda: { type: 'integer' },
      produtosAplicados: { type: 'array', items: { type: 'object' } },
      setorId: { type: 'string', format: 'uuid' },
      fazenda_id: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  // Nota Fiscal
  NotaFiscal: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      dataNota: { type: 'string', format: 'date' },
      dataPagamento: { type: 'string', format: 'date' },
      codigo_de_barras: { type: 'string' },
      codigo_da_nota: { type: 'string' },
      cultura: { type: 'string', enum: ['uva', 'manga'] },
      statusPagamento: { type: 'string', enum: ['pendente', 'pago'] },
      fornecedor_id: { type: 'string', format: 'uuid' },
      fazenda_id: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  // Dashboard
  Dashboard: {
    type: 'object',
    properties: {
      totalEmStock: { type: 'number' },
      totalEntrada: { type: 'number' },
      totalProduto: { type: 'number' },
      totalSaida: { type: 'number' },
      colheitaMes: { type: 'number' },
      estoqueBaixo: { type: 'array', items: { type: 'object' } },
      tipoCaixa: { type: 'array', items: { type: 'object' } }
    }
  },

  // Schemas de Rentabilidade
  ...rentabilidadeSchemas
}
