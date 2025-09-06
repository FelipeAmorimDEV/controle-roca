import { FastifyInstance } from 'fastify'
import { swaggerConfig } from './swagger-config'
import { schemas } from './schemas'
import { requestSchemas } from './schemas/requests'
import { responseSchemas } from './schemas/responses'

export async function setupSwagger(app: FastifyInstance) {
  // Registrar o Swagger
  await app.register(import('@fastify/swagger'), {
    ...swaggerConfig.openapi,
    components: {
      ...swaggerConfig.openapi.components,
      schemas: {
        ...schemas,
        ...requestSchemas,
        ...responseSchemas
      }
    }
  })

  // Registrar o Swagger UI
  await app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (_request, _reply, next) {
        next()
      },
      preHandler: function (_request, _reply, next) {
        next()
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, _request, _reply) => {
      return swaggerObject
    },
    transformSpecificationClone: true
  })

  // Adicionar schemas de segurança
  app.addSchema({
    $id: 'security',
    type: 'object',
    properties: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  })

  // Adicionar schemas de paginação
  app.addSchema({
    $id: 'pagination',
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      perPage: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      total: { type: 'integer' }
    }
  })

  // Adicionar schemas de filtros de data
  app.addSchema({
    $id: 'dateFilters',
    type: 'object',
    properties: {
      initialDate: { type: 'string', format: 'date' },
      endDate: { type: 'string', format: 'date' }
    }
  })

  // Adicionar schemas de busca
  app.addSchema({
    $id: 'search',
    type: 'object',
    properties: {
      q: { type: 'string', description: 'Termo de busca' },
      page: { type: 'integer', minimum: 1, default: 1 },
      perPage: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
    }
  })

  console.log('📚 Swagger documentation available at: http://localhost:3333/docs')
}
