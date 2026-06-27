// Declara a especificação OpenAPI usada na documentação Scalar.
export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API Lanchonete UNEMAT',
    version: '1.0.0',
    description: 'API REST para gerenciamento de itens da lanchonete universitária.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  tags: [
    { name: 'Itens', description: 'Operações de CRUD para itens do cardápio' },
    { name: 'Auth', description: 'Status da estratégia de autenticação' },
  ],
  components: {
    schemas: {
      Item: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          descricao: { type: 'string' },
          preco: { type: 'number', format: 'float' },
          categoria: { type: 'string', enum: ['Lanche', 'Bebida', 'Sobremesa'] },
          disponivel: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      ItemInput: {
        type: 'object',
        required: ['nome', 'preco', 'categoria'],
        properties: {
          nome: { type: 'string' },
          descricao: { type: 'string' },
          preco: { type: 'number', format: 'float' },
          categoria: { type: 'string', enum: ['Lanche', 'Bebida', 'Sobremesa'] },
          disponivel: { type: 'boolean' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api/itens': {
      get: {
        tags: ['Itens'],
        summary: 'Lista itens',
        parameters: [
          {
            in: 'query',
            name: 'categoria',
            schema: { type: 'string', enum: ['Lanche', 'Bebida', 'Sobremesa'] },
          },
          {
            in: 'query',
            name: 'disponivel',
            schema: { type: 'boolean' },
          },
        ],
        responses: {
          200: {
            description: 'Lista de itens',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Item' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Itens'],
        summary: 'Cria item',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ItemInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Item criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Item' },
              },
            },
          },
          400: {
            description: 'Erro de validação',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/itens/{id}': {
      get: {
        tags: ['Itens'],
        summary: 'Busca item por ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: {
          200: {
            description: 'Item encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Item' },
              },
            },
          },
          404: {
            description: 'Item não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Itens'],
        summary: 'Atualiza item',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  descricao: { type: 'string' },
                  preco: { type: 'number', format: 'float' },
                  categoria: { type: 'string', enum: ['Lanche', 'Bebida', 'Sobremesa'] },
                  disponivel: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Item atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Item' },
              },
            },
          },
          400: {
            description: 'Erro de validação',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Item não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Itens'],
        summary: 'Remove item',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Item removido' },
          404: {
            description: 'Item não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/status': {
      get: {
        tags: ['Auth'],
        summary: 'Status da autenticação',
        responses: {
          200: {
            description: 'Status de autenticação',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
