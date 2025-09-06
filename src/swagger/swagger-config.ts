export const swaggerConfig = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Controle de Fazenda - API',
      description:
        'API completa para gestão de fazendas, incluindo controle de estoque, funcionários, colheitas, tratores e muito mais.',
      version: '1.0.0',
      contact: {
        name: 'Equipe de Desenvolvimento',
        email: 'dev@fazenda.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de Desenvolvimento',
      },
      {
        url: 'https://api.fazenda.com',
        description: 'Servidor de Produção',
      },
    ],
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints para autenticação e gerenciamento de usuários',
      },
      {
        name: 'Fazendas',
        description: 'Gerenciamento de fazendas',
      },
      {
        name: 'Produtos e Estoque',
        description: 'Controle completo de produtos e movimentações de estoque',
      },
      {
        name: 'Funcionários',
        description:
          'Gestão de funcionários, apontamentos e folha de pagamento',
      },
      {
        name: 'Setores e Atividades',
        description: 'Gerenciamento de setores da fazenda e atividades',
      },
      {
        name: 'Colheitas',
        description: 'Registro e controle de colheitas e preços de venda',
      },
      {
        name: 'Tratores e Manutenção',
        description: 'Gestão de tratores, manutenções e controle de horas',
      },
      {
        name: 'Aplicações e Fertirrigação',
        description: 'Controle de aplicações de produtos e fertirrigação',
      },
      {
        name: 'QR Codes e Pallets',
        description: 'Sistema de QR codes para funcionários e pallets',
      },
      {
        name: 'Notas Fiscais',
        description: 'Gestão de notas fiscais e fornecedores',
      },
      {
        name: 'Relatórios e Dashboard',
        description: 'Relatórios gerenciais e dados do dashboard',
      },
      {
        name: 'Cadastros Auxiliares',
        description: 'Tipos, fornecedores, variedades, caixas e tratoristas',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro',
            },
            error: {
              type: 'string',
              description: 'Tipo do erro',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se a operação foi bem-sucedida',
            },
            message: {
              type: 'string',
              description: 'Mensagem de sucesso',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Página atual',
            },
            perPage: {
              type: 'integer',
              description: 'Itens por página',
            },
            total: {
              type: 'integer',
              description: 'Total de itens',
            },
          },
        },
      },
    },
  },
}