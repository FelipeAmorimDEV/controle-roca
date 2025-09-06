// Exemplos de endpoints já documentados
// Este arquivo mostra como implementar a documentação nos controladores

import { FastifyInstance } from 'fastify'

export function addDocumentedEndpoints(app: FastifyInstance) {
  // Exemplo 1: Endpoint de autenticação
  app.post('/users/authenticate', {
    schema: {
      tags: ['Autenticação'],
      summary: 'Autenticar usuário',
      description: 'Realiza login do usuário e retorna token JWT para acesso à API',
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
              },
              example: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                users: {
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  user: 'admin',
                  nome: 'João Silva',
                  role: 'admin',
                  fazenda_id: '123e4567-e89b-12d3-a456-426614174001',
                  fazenda_nome: 'Fazenda São José'
                }
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
              },
              example: {
                message: 'Credenciais inválidas'
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    // Implementação do controlador
    return reply.send({ message: 'Endpoint de exemplo' })
  })

  // Exemplo 2: Endpoint de produtos com paginação
  app.get('/products', {
    schema: {
      tags: ['Produtos e Estoque'],
      summary: 'Listar produtos',
      description: 'Lista todos os produtos com paginação, busca e filtros',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          q: { 
            type: 'string', 
            description: 'Termo de busca no nome do produto',
            example: 'fertilizante'
          },
          page: { 
            type: 'integer', 
            minimum: 1, 
            default: 1,
            description: 'Número da página'
          },
          perPage: { 
            type: 'integer', 
            minimum: 1, 
            maximum: 100, 
            default: 10,
            description: 'Quantidade de itens por página'
          },
          all: { 
            type: 'boolean', 
            default: false,
            description: 'Retornar todos os produtos sem paginação'
          }
        }
      },
      response: {
        200: {
          description: 'Lista de produtos retornada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductsListResponse'
              },
              example: {
                products: [
                  {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Fertilizante NPK 20-10-10',
                    unit: 'kg',
                    price: 25.50,
                    quantity: 100,
                    tipoId: '123e4567-e89b-12d3-a456-426614174002',
                    fornecedorId: '123e4567-e89b-12d3-a456-426614174003',
                    fazenda_id: '123e4567-e89b-12d3-a456-426614174001'
                  }
                ],
                total: 50,
                totalEstoque: 5000.50
              }
            }
          }
        },
        401: {
          description: 'Token JWT inválido ou expirado',
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
  }, async (request, reply) => {
    // Implementação do controlador
    return reply.send({ message: 'Endpoint de exemplo' })
  })

  // Exemplo 3: Endpoint de dashboard
  app.get('/dashboard', {
    schema: {
      tags: ['Relatórios e Dashboard'],
      summary: 'Obter dados do dashboard',
      description: 'Retorna métricas principais do sistema para exibição no dashboard principal',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Dados do dashboard retornados com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DashboardResponse'
              },
              example: {
                totalEmStock: 5000.50,
                totalEntrada: 10000.00,
                totalProduto: 15000.00,
                totalSaida: 5000.00,
                colheitaMes: 2000.00,
                estoqueBaixo: [
                  {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Fertilizante NPK',
                    quantity: 5
                  }
                ],
                tipoCaixa: [
                  {
                    id: 1,
                    nome: 'Caixa 20kg',
                    quantidade: 100
                  }
                ]
              }
            }
          }
        },
        401: {
          description: 'Token JWT inválido ou expirado',
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
  }, async (request, reply) => {
    // Implementação do controlador
    return reply.send({ message: 'Endpoint de exemplo' })
  })

  // Exemplo 4: Endpoint de colheita com validação
  app.post('/colheita', {
    schema: {
      tags: ['Colheitas'],
      summary: 'Registrar colheita',
      description: 'Registra uma nova colheita no sistema com validação de dados',
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
              },
              example: {
                colheita: {
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  pesoCaixa: 20,
                  pesoTotal: 400,
                  qntCaixa: 20,
                  tipoCaixa: 1,
                  variedade: 'Vitoria',
                  setorId: '123e4567-e89b-12d3-a456-426614174001',
                  fazenda_id: '123e4567-e89b-12d3-a456-426614174002',
                  createdAt: '2024-01-15T10:30:00Z'
                }
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos ou setor não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Setor não encontrado'
              }
            }
          }
        },
        401: {
          description: 'Token JWT inválido ou expirado',
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
  }, async (request, reply) => {
    // Implementação do controlador
    return reply.send({ message: 'Endpoint de exemplo' })
  })

  // Exemplo 5: Endpoint de trator com manutenção
  app.post('/tratores', {
    schema: {
      tags: ['Tratores e Manutenção'],
      summary: 'Cadastrar trator',
      description: 'Cadastra um novo trator no sistema com configuração de alertas de manutenção',
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
              },
              example: {
                success: true,
                message: 'Trator registrado com sucesso!',
                trator: {
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  nome: 'Trator 1',
                  marca: 'John Deere',
                  modelo: '6120J',
                  ano: 2020,
                  numeroSerie: 'JD123456',
                  horasAtuais: 1500.5,
                  dataCompra: '2020-01-15',
                  status: 'ATIVO',
                  fazenda_id: '123e4567-e89b-12d3-a456-426614174001'
                }
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos ou número de série já existe',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Número de série já cadastrado'
              }
            }
          }
        },
        401: {
          description: 'Token JWT inválido ou expirado',
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
  }, async (request, reply) => {
    // Implementação do controlador
    return reply.send({ message: 'Endpoint de exemplo' })
  })

  // Exemplo 6: Endpoint de apontamento com validação complexa
  app.post('/apontamento/register', {
    schema: {
      tags: ['Funcionários'],
      summary: 'Criar apontamento',
      description: 'Cria um novo apontamento de atividade para funcionário com validação de dados',
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
              },
              example: {
                apontamento: {
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  data_inicio: '2024-01-15T08:00:00Z',
                  data_fim: null,
                  status: 'em andamento',
                  meta: 100,
                  qtd_tarefa: null,
                  custo_tarefa: null,
                  valor_bonus: 0,
                  duracao_horas: null,
                  tipo_apontamento: 'meta',
                  funcionario_id: '123e4567-e89b-12d3-a456-426614174001',
                  atividade_id: '123e4567-e89b-12d3-a456-426614174002',
                  setor_id: '123e4567-e89b-12d3-a456-426614174003',
                  fazenda_id: '123e4567-e89b-12d3-a456-426614174004'
                }
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos ou funcionário/atividade/setor não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Funcionário não encontrado'
              }
            }
          }
        },
        401: {
          description: 'Token JWT inválido ou expirado',
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
  }, async (request, reply) => {
    // Implementação do controlador
    return reply.send({ message: 'Endpoint de exemplo' })
  })
}
