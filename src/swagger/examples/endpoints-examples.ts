// Exemplos de como documentar os endpoints nos controladores
// Este arquivo serve como referência para implementar a documentação nos controladores

export const endpointExamples = {
  // Exemplo de documentação para um endpoint de autenticação
  authenticateUser: {
    schema: {
      tags: ['Autenticação'],
      summary: 'Autenticar usuário',
      description: 'Realiza login do usuário e retorna token JWT',
      body: {
        $ref: '#/components/schemas/AuthenticateRequest'
      },
      response: {
        200: {
          description: 'Login realizado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthenticateResponse'
              }
            }
          }
        },
        401: {
          description: 'Credenciais inválidas',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },

  // Exemplo de documentação para um endpoint de produtos
  createProduct: {
    schema: {
      tags: ['Produtos e Estoque'],
      summary: 'Criar produto',
      description: 'Cadastra um novo produto no sistema',
      security: [{ bearerAuth: [] }],
      body: {
        $ref: '#/components/schemas/CreateProductRequest'
      },
      response: {
        201: {
          description: 'Produto criado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductResponse'
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        401: {
          description: 'Token inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },

  // Exemplo de documentação para um endpoint de listagem
  fetchProducts: {
    schema: {
      tags: ['Produtos e Estoque'],
      summary: 'Listar produtos',
      description: 'Lista todos os produtos com paginação e filtros',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string', description: 'Termo de busca' },
          page: { type: 'integer', minimum: 1, default: 1 },
          perPage: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          all: { type: 'boolean', default: false }
        }
      },
      response: {
        200: {
          description: 'Lista de produtos retornada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductsListResponse'
              }
            }
          }
        },
        401: {
          description: 'Token inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },

  // Exemplo de documentação para um endpoint de dashboard
  getDashboardData: {
    schema: {
      tags: ['Relatórios e Dashboard'],
      summary: 'Obter dados do dashboard',
      description: 'Retorna métricas principais do sistema para o dashboard',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Dados do dashboard retornados com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DashboardResponse'
              }
            }
          }
        },
        401: {
          description: 'Token inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },

  // Exemplo de documentação para um endpoint de colheita
  createColheita: {
    schema: {
      tags: ['Colheitas'],
      summary: 'Registrar colheita',
      description: 'Registra uma nova colheita no sistema',
      security: [{ bearerAuth: [] }],
      body: {
        $ref: '#/components/schemas/CreateColheitaRequest'
      },
      response: {
        201: {
          description: 'Colheita registrada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ColheitaResponse'
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        401: {
          description: 'Token inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },

  // Exemplo de documentação para um endpoint de trator
  createTrator: {
    schema: {
      tags: ['Tratores e Manutenção'],
      summary: 'Cadastrar trator',
      description: 'Cadastra um novo trator com alertas de manutenção',
      security: [{ bearerAuth: [] }],
      body: {
        $ref: '#/components/schemas/CreateTratorRequest'
      },
      response: {
        201: {
          description: 'Trator cadastrado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TratorResponse'
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        401: {
          description: 'Token inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },

  // Exemplo de documentação para um endpoint de apontamento
  createApontamento: {
    schema: {
      tags: ['Funcionários'],
      summary: 'Criar apontamento',
      description: 'Cria um novo apontamento de atividade para funcionário',
      security: [{ bearerAuth: [] }],
      body: {
        $ref: '#/components/schemas/CreateApontamentoRequest'
      },
      response: {
        201: {
          description: 'Apontamento criado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApontamentoResponse'
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        401: {
          description: 'Token inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  }
}
