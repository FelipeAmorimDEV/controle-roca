export const requestSchemas = {
  // Autenticação
  CreateUserRequest: {
    type: 'object',
    required: ['user', 'nome', 'fazendaNome', 'password', 'fazendaId'],
    properties: {
      user: { type: 'string', example: 'admin' },
      nome: { type: 'string', example: 'João Silva' },
      fazendaNome: { type: 'string', example: 'Fazenda São José' },
      password: { type: 'string', example: 'senha123' },
      fazendaId: { type: 'string', format: 'uuid' }
    }
  },

  AuthenticateRequest: {
    type: 'object',
    required: ['user', 'password'],
    properties: {
      user: { type: 'string', example: 'admin' },
      password: { type: 'string', example: 'senha123' }
    }
  },

  CreateFazendaRequest: {
    type: 'object',
    required: ['nome'],
    properties: {
      nome: { type: 'string', example: 'Fazenda São José' }
    }
  },

  // Produtos
  CreateProductRequest: {
    type: 'object',
    required: ['name', 'unit', 'tipoId'],
    properties: {
      name: { type: 'string', example: 'Fertilizante NPK 20-10-10' },
      unit: { type: 'string', enum: ['l', 'kg', 'ud'], example: 'kg' },
      tipoId: { type: 'string', format: 'uuid' }
    }
  },

  InsertProductRequest: {
    type: 'object',
    required: ['quantity', 'createdIn', 'valorUnidade'],
    properties: {
      quantity: { type: 'number', example: 100 },
      createdIn: { type: 'string', example: '2024-01-15' },
      valorUnidade: { type: 'number', example: 25.50 }
    }
  },

  WithdrawProductRequest: {
    type: 'object',
    required: ['quantity', 'setorId', 'createdIn'],
    properties: {
      quantity: { type: 'number', example: 50 },
      setorId: { type: 'string', format: 'uuid' },
      createdIn: { type: 'string', example: '2024-01-15' }
    }
  },

  // Funcionários
  CreateFuncionarioRequest: {
    type: 'object',
    required: ['nome', 'cargo', 'tipoContratacao'],
    properties: {
      nome: { type: 'string', example: 'João Silva' },
      cargo: { type: 'string', example: 'Operador' },
      tipoContratacao: { type: 'string', enum: ['fichado', 'terceirizado'], example: 'fichado' }
    }
  },

  UpdateFuncionarioRequest: {
    type: 'object',
    required: ['cargo', 'tipoContratacao', 'funcionarioId'],
    properties: {
      cargo: { type: 'string', example: 'Supervisor' },
      tipoContratacao: { type: 'string', enum: ['fichado', 'terceirizado'], example: 'fichado' },
      funcionarioId: { type: 'string', format: 'uuid' }
    }
  },

  // Setores
  CreateSetorRequest: {
    type: 'object',
    required: ['setorName', 'variedade', 'tamanhoArea', 'filas'],
    properties: {
      setorName: { type: 'string', example: 'Setor A' },
      variedade: { type: 'integer', example: 1 },
      tamanhoArea: { type: 'number', example: 2.5 },
      filas: { type: 'string', example: '10' }
    }
  },

  UpdateDataPodaRequest: {
    type: 'object',
    required: ['setorId', 'dataPoda'],
    properties: {
      setorId: { type: 'string', format: 'uuid' },
      dataPoda: { type: 'string', format: 'date', example: '2024-01-15' }
    }
  },

  // Colheitas
  CreateColheitaRequest: {
    type: 'object',
    required: ['pesoCaixa', 'pesoTotal', 'qntCaixa', 'tipoCaixa', 'setorId', 'data', 'variedade'],
    properties: {
      pesoCaixa: { type: 'integer', example: 20 },
      pesoTotal: { type: 'integer', example: 400 },
      qntCaixa: { type: 'integer', example: 20 },
      tipoCaixa: { type: 'integer', example: 1 },
      setorId: { type: 'string', format: 'uuid' },
      data: { type: 'string', example: '2024-01-15' },
      variedade: { type: 'string', example: 'Vitoria' }
    }
  },

  CreatePrecoVendaRequest: {
    type: 'object',
    required: ['classificacao', 'variedade', 'preco', 'dataInicio', 'dataFim'],
    properties: {
      classificacao: { type: 'string', example: 'A' },
      variedade: { type: 'string', example: 'Vitoria' },
      preco: { type: 'number', example: 15.50 },
      dataInicio: { type: 'string', format: 'date', example: '2024-01-01' },
      dataFim: { type: 'string', format: 'date', example: '2024-12-31' }
    }
  },

  // Tratores
  CreateTratorRequest: {
    type: 'object',
    required: ['nome', 'marca', 'modelo', 'ano', 'numeroSerie', 'horasAtuais', 'dataCompra', 'manutencoes'],
    properties: {
      nome: { type: 'string', example: 'Trator 1' },
      marca: { type: 'string', example: 'John Deere' },
      modelo: { type: 'string', example: '6120J' },
      ano: { type: 'integer', example: 2020 },
      numeroSerie: { type: 'string', example: 'JD123456' },
      horasAtuais: { type: 'number', example: 1500.5 },
      dataCompra: { type: 'string', format: 'date', example: '2020-01-15' },
      manutencoes: {
        type: 'array',
        items: {
          type: 'object',
          required: ['tipo', 'intervaloHoras', 'proximaManutencaoHoras', 'descricao'],
          properties: {
            tipo: { type: 'string', enum: ['CORRETIVA', 'FILTROS', 'OUTROS', 'PREVENTIVA', 'TROCA_OLEO'] },
            intervaloHoras: { type: 'number', example: 500 },
            proximaManutencaoHoras: { type: 'number', example: 2000 },
            descricao: { type: 'string', example: 'Troca de óleo do motor' }
          }
        }
      }
    }
  },

  UpdateHorasTratorRequest: {
    type: 'object',
    required: ['horasNovas', 'operador'],
    properties: {
      horasNovas: { type: 'number', example: 1600.5 },
      descricao: { type: 'string', example: 'Trabalho no setor A' },
      operador: { type: 'string', example: 'João Silva' }
    }
  },

  RegisterManutencaoRequest: {
    type: 'object',
    required: ['tipo', 'descricao', 'custo', 'mecanico'],
    properties: {
      tipo: { type: 'string', enum: ['TROCA_OLEO', 'FILTROS', 'PREVENTIVA', 'CORRETIVA', 'OUTROS'] },
      descricao: { type: 'string', example: 'Troca de óleo do motor' },
      custo: { type: 'number', example: 500.00 },
      mecanico: { type: 'string', example: 'Mecânico João' },
      status: { type: 'string', enum: ['AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'], default: 'CONCLUIDA' },
      observacoes: { type: 'string', example: 'Manutenção realizada com sucesso' }
    }
  },

  // Apontamentos
  CreateApontamentoRequest: {
    type: 'object',
    required: ['funcionarioId', 'setorId', 'atividadeId', 'meta', 'data_inicio', 'tipoApontamento'],
    properties: {
      funcionarioId: { type: 'string', format: 'uuid' },
      setorId: { type: 'string', format: 'uuid' },
      atividadeId: { type: 'string', format: 'uuid' },
      meta: { type: 'integer', example: 100 },
      data_inicio: { type: 'string', example: '2024-01-15T08:00:00Z' },
      tipoApontamento: { type: 'string', enum: ['meta', 'horas'], example: 'meta' }
    }
  },

  ConcluirApontamentoRequest: {
    type: 'object',
    required: ['dataConclusao', 'qtdAtividade', 'valorBonus'],
    properties: {
      dataConclusao: { type: 'string', example: '2024-01-15T17:00:00Z' },
      qtdAtividade: { type: 'integer', example: 120 },
      valorBonus: { type: 'number', example: 50.00 }
    }
  },

  // Aplicações
  CreateAplicacaoRequest: {
    type: 'object',
    required: ['aplicador', 'volumeCalda', 'setorId', 'produtosAplicados'],
    properties: {
      aplicador: { type: 'string', example: 'João Silva' },
      volumeCalda: { type: 'integer', example: 200 },
      setorId: { type: 'string', format: 'uuid' },
      produtosAplicados: {
        type: 'array',
        items: {
          type: 'object',
          required: ['produto', 'dosagem', 'total'],
          properties: {
            produto: { type: 'string', example: 'Fertilizante NPK' },
            dosagem: { type: 'number', example: 2.5 },
            total: { type: 'number', example: 500 }
          }
        }
      }
    }
  },

  // Fertirrigação
  CreateFertirrigacaoRequest: {
    type: 'object',
    required: ['aplicadorId', 'setorId', 'semana', 'produtos'],
    properties: {
      aplicadorId: { type: 'string', format: 'uuid' },
      setorId: { type: 'string', format: 'uuid' },
      semana: { type: 'string', example: 'Semana 1' },
      produtos: {
        type: 'array',
        items: {
          type: 'object',
          required: ['produtoId', 'quantidade'],
          properties: {
            produtoId: { type: 'string', format: 'uuid' },
            quantidade: { type: 'number', example: 100 }
          }
        }
      }
    }
  },

  // QR Codes
  GenerateQrcodeRequest: {
    type: 'object',
    required: ['quantidade', 'funcionarioId'],
    properties: {
      quantidade: { type: 'integer', example: 10 },
      funcionarioId: { type: 'string', format: 'uuid' }
    }
  },

  ValidateQrcodeRequest: {
    type: 'object',
    required: ['qrCodeData', 'palletId'],
    properties: {
      qrCodeData: {
        type: 'object',
        required: ['nome', 'qrcodeId', 'funcionarioId'],
        properties: {
          nome: { type: 'string', example: 'João Silva' },
          qrcodeId: { type: 'string', example: 'qr123456' },
          funcionarioId: { type: 'string', format: 'uuid' }
        }
      },
      palletId: { type: 'string', format: 'uuid' }
    }
  },

  GeneratePalletRequest: {
    type: 'object',
    required: ['quantidade', 'variedadeId', 'peso', 'caixaId', 'qtdCaixas', 'setorId'],
    properties: {
      quantidade: { type: 'integer', example: 50 },
      variedadeId: { type: 'integer', example: 1 },
      peso: { type: 'integer', example: 20 },
      caixaId: { type: 'integer', example: 1 },
      qtdCaixas: { type: 'integer', example: 25 },
      setorId: { type: 'string', format: 'uuid' }
    }
  },

  // Notas Fiscais
  CreateNotaFiscalRequest: {
    type: 'object',
    required: ['dataNota', 'fornecedorId', 'produtos'],
    properties: {
      cultura: { type: 'string', enum: ['uva', 'manga'], default: 'uva' },
      dataNota: { type: 'string', format: 'date', example: '2024-01-15' },
      dataPagamento: { type: 'string', format: 'date', example: '2024-01-30' },
      statusPagamento: { type: 'string', enum: ['pendente', 'pago'], default: 'pendente' },
      codigoDeBarras: { type: 'string', example: '7891234567890' },
      codigoNota: { type: 'string', example: 'NF001' },
      fornecedorId: { type: 'string', format: 'uuid' },
      produtos: {
        type: 'array',
        items: {
          type: 'object',
          required: ['productId', 'quantidade', 'valor'],
          properties: {
            productId: { type: 'string', format: 'uuid' },
            quantidade: { type: 'number', example: 100 },
            valor: { type: 'number', example: 25.50 }
          }
        }
      }
    }
  },

  // Atividades
  CreateAtividadeRequest: {
    type: 'object',
    required: ['nome', 'categoria'],
    properties: {
      nome: { type: 'string', example: 'Poda' },
      categoria: { type: 'string', example: 'Cultivo' }
    }
  },

  // Cadastros Auxiliares
  CreateTipoRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', example: 'Fertilizante' }
    }
  },

  CreateFornecedorRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', example: 'Fornecedor ABC Ltda' }
    }
  },

  CreateVariedadeRequest: {
    type: 'object',
    required: ['nome'],
    properties: {
      nome: { type: 'string', example: 'Vitoria' }
    }
  },

  CreateCaixaRequest: {
    type: 'object',
    required: ['nome'],
    properties: {
      nome: { type: 'string', example: 'Caixa 20kg' }
    }
  },

  CreateTratoristaRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', example: 'João Silva' }
    }
  }
}
