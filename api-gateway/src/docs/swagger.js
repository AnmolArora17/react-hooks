import swaggerJsdoc from 'swagger-jsdoc';

export function loadSwaggerSpec() {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: { title: 'E-commerce API Gateway', version: '1.0.0' }
    },
    apis: []
  };
  return swaggerJsdoc(options);
}