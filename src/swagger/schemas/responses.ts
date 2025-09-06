export const responseSchemas = {
  // Respostas de sucesso genéricas
  SuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Operação realizada com sucesso' }
    }
  },

  // Autenticação
  AuthenticateResponse: {
    type: 'object',
    properties: {
      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      users: { $ref: '#/components/schemas/User' }
    }
  },

  // Produtos
  ProductsListResponse: {
    type: 'object',
    properties: {
      products: {
        type: 'array',
        items: { $ref: '#/components/schemas/Product' }
      },
      total: { type: 'integer', example: 100 },
      totalEstoque: { type: 'number', example: 5000.50 }
    }
  },

  ProductResponse: {
    type: 'object',
    properties: {
      product: { $ref: '#/components/schemas/Product' }
    }
  },

  // Estoque
  EntradasListResponse: {
    type: 'object',
    properties: {
      entradas: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            quantity: { type: 'number' },
            priceEntrada: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            product: { $ref: '#/components/schemas/Product' },
            user: { $ref: '#/components/schemas/User' }
          }
        }
      },
      total: { type: 'integer', example: 50 },
      entradasTotal: { type: 'number', example: 10000.00 }
    }
  },

  SaidasListResponse: {
    type: 'object',
    properties: {
      saidas: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            quantity: { type: 'number' },
            priceSaida: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            product: { $ref: '#/components/schemas/Product' },
            setor: { $ref: '#/components/schemas/Setor' },
            user: { $ref: '#/components/schemas/User' }
          }
        }
      },
      total: { type: 'integer', example: 30 },
      saidasTotal: { type: 'number', example: 5000.00 }
    }
  },

  // Funcionários
  FuncionariosListResponse: {
    type: 'object',
    properties: {
      funcionarios: {
        type: 'array',
        items: { $ref: '#/components/schemas/Funcionario' }
      }
    }
  },

  FuncionarioResponse: {
    type: 'object',
    properties: {
      funcionario: { $ref: '#/components/schemas/Funcionario' }
    }
  },

  // Setores
  SetoresListResponse: {
    type: 'object',
    properties: {
      setores: {
        type: 'array',
        items: { $ref: '#/components/schemas/Setor' }
      }
    }
  },

  SetorResponse: {
    type: 'object',
    properties: {
      setor: { $ref: '#/components/schemas/Setor' }
    }
  },

  // Colheitas
  ColheitasListResponse: {
    type: 'object',
    properties: {
      colheitas: {
        type: 'array',
        items: { $ref: '#/components/schemas/Colheita' }
      },
      total: { type: 'integer', example: 200 },
      totalColhido: { type: 'number', example: 10000.00 },
      lucroTotal: { type: 'number', example: 50000.00 }
    }
  },

  ColheitaResponse: {
    type: 'object',
    properties: {
      colheita: { $ref: '#/components/schemas/Colheita' }
    }
  },

  // Tratores
  TratoresListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      tratores: {
        type: 'array',
        items: { $ref: '#/components/schemas/Trator' }
      },
      totalTratores: { type: 'integer', example: 5 }
    }
  },

  TratorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Trator registrado com sucesso!' },
      trator: { $ref: '#/components/schemas/Trator' }
    }
  },

  // Apontamentos
  ApontamentosListResponse: {
    type: 'object',
    properties: {
      apontamentos: {
        type: 'array',
        items: { $ref: '#/components/schemas/Apontamento' }
      },
      total: { type: 'integer', example: 150 }
    }
  },

  ApontamentoResponse: {
    type: 'object',
    properties: {
      apontamento: { $ref: '#/components/schemas/Apontamento' }
    }
  },

  ApontamentoDashboardResponse: {
    type: 'object',
    properties: {
      apontamentos: {
        type: 'array',
        items: { $ref: '#/components/schemas/Apontamento' }
      },
      dashboard: {
        type: 'object',
        properties: {
          totalApontamentos: { type: 'integer' },
          apontamentosConcluidos: { type: 'integer' },
          apontamentosPendentes: { type: 'integer' },
          totalHorasTrabalhadas: { type: 'number' },
          totalBonus: { type: 'number' }
        }
      }
    }
  },

  // Aplicações
  AplicacoesListResponse: {
    type: 'object',
    properties: {
      aplicacoes: {
        type: 'array',
        items: { $ref: '#/components/schemas/Aplicacao' }
      },
      totalAplicacoes: { type: 'integer', example: 75 }
    }
  },

  AplicacaoResponse: {
    type: 'object',
    properties: {
      aplicacao: { $ref: '#/components/schemas/Aplicacao' }
    }
  },

  // Fertirrigação
  FertirrigacoesListResponse: {
    type: 'object',
    properties: {
      fertirrigacoes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            created_at: { type: 'string', format: 'date-time' },
            finalized_at: { type: 'string', format: 'date-time' },
            semana: { type: 'string' },
            funcionario: { $ref: '#/components/schemas/Funcionario' },
            setor: { $ref: '#/components/schemas/Setor' },
            produtos: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  produto: { $ref: '#/components/schemas/Product' },
                  quantidade: { type: 'number' }
                }
              }
            }
          }
        }
      },
      total: { type: 'integer', example: 25 }
    }
  },

  FertirrigacaoResponse: {
    type: 'object',
    properties: {
      fertirrigacao: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          created_at: { type: 'string', format: 'date-time' },
          semana: { type: 'string' },
          funcionario: { $ref: '#/components/schemas/Funcionario' },
          setor: { $ref: '#/components/schemas/Setor' },
          produtos: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                produto: { $ref: '#/components/schemas/Product' },
                quantidade: { type: 'number' }
              }
            }
          }
        }
      }
    }
  },

  // QR Codes
  QrcodesListResponse: {
    type: 'object',
    properties: {
      qrcodes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            usado: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            validated_at: { type: 'string', format: 'date-time' },
            funcionario: { $ref: '#/components/schemas/Funcionario' }
          }
        }
      }
    }
  },

  QrcodeResponse: {
    type: 'object',
    properties: {
      qrcode: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          usado: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          validated_at: { type: 'string', format: 'date-time' },
          funcionario: { $ref: '#/components/schemas/Funcionario' },
          pallet: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              peso: { type: 'integer' },
              qtdCaixas: { type: 'integer' },
              qtdFeitas: { type: 'integer' },
              finalizado: { type: 'boolean' }
            }
          }
        }
      }
    }
  },

  // Pallets
  PalletsListResponse: {
    type: 'object',
    properties: {
      pallets: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            usado: { type: 'boolean' },
            peso: { type: 'integer' },
            qtdCaixas: { type: 'integer' },
            qtdFeitas: { type: 'integer' },
            finalizado: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            variedade: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                nome: { type: 'string' }
              }
            },
            caixa: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                nome: { type: 'string' }
              }
            },
            setor: { $ref: '#/components/schemas/Setor' }
          }
        }
      }
    }
  },

  // Notas Fiscais
  NotasFiscaisListResponse: {
    type: 'object',
    properties: {
      notasFiscais: {
        type: 'array',
        items: { $ref: '#/components/schemas/NotaFiscal' }
      },
      total: { type: 'integer', example: 50 }
    }
  },

  NotaFiscalResponse: {
    type: 'object',
    properties: {
      notaFiscal: { $ref: '#/components/schemas/NotaFiscal' }
    }
  },

  // Dashboard
  DashboardResponse: {
    type: 'object',
    properties: {
      totalEmStock: { type: 'number', example: 5000.50 },
      totalEntrada: { type: 'number', example: 10000.00 },
      totalProduto: { type: 'number', example: 15000.00 },
      totalSaida: { type: 'number', example: 5000.00 },
      colheitaMes: { type: 'number', example: 2000.00 },
      estoqueBaixo: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            quantity: { type: 'number' }
          }
        }
      },
      tipoCaixa: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            quantidade: { type: 'integer' }
          }
        }
      }
    }
  },

  // Atividades
  AtividadesListResponse: {
    type: 'object',
    properties: {
      atividades: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
            categoria: { type: 'string' },
            fazenda_id: { type: 'string', format: 'uuid' }
          }
        }
      }
    }
  },

  // Cadastros Auxiliares
  TiposListResponse: {
    type: 'object',
    properties: {
      tipos: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            fazenda_id: { type: 'string', format: 'uuid' }
          }
        }
      }
    }
  },

  FornecedoresListResponse: {
    type: 'object',
    properties: {
      fornecedores: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            fazenda_id: { type: 'string', format: 'uuid' }
          }
        }
      }
    }
  },

  VariedadesListResponse: {
    type: 'object',
    properties: {
      variedades: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            fazenda_id: { type: 'string', format: 'uuid' }
          }
        }
      }
    }
  },

  CaixasListResponse: {
    type: 'object',
    properties: {
      caixas: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            fazenda_id: { type: 'string', format: 'uuid' }
          }
        }
      }
    }
  },

  TratoristasListResponse: {
    type: 'object',
    properties: {
      tratoristas: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' }
          }
        }
      }
    }
  },

  // Relatórios
  RelatorioCustosResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      relatorio: {
        type: 'object',
        properties: {
          totalCustos: { type: 'number', example: 5000.00 },
          manutencoes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                tipo: { type: 'string' },
                descricao: { type: 'string' },
                custo: { type: 'number' },
                dataManutencao: { type: 'string', format: 'date-time' },
                mecanico: { type: 'string' }
              }
            }
          }
        }
      }
    }
  },

  CentroCustoResponse: {
    type: 'object',
    properties: {
      setores: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            setorName: { type: 'string' },
            custoTotal: { type: 'number' },
            aplicacoes: { type: 'integer' },
            fertirrigacoes: { type: 'integer' }
          }
        }
      }
    }
  },

  // Folha de Pagamento
  FolhaPagamentoResponse: {
    type: 'object',
    properties: {
      folhaPagamento: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            mesReferencia: { type: 'string', format: 'date' },
            funcionario: { $ref: '#/components/schemas/Funcionario' },
            totalDiasTrabalhados: { type: 'integer' },
            totalHorasTrabalhadas: { type: 'number' },
            custo_total: { type: 'number' }
          }
        }
      }
    }
  }
}
