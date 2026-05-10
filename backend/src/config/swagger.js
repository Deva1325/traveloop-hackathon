const swaggerUi = require('swagger-ui-express');
const swaggerDocument = {
  openapi: '3.0.0',
  info: { title: 'Traveloop API', version: '1.0.0', description: 'API Documentation for Traveloop Platform' },
  servers: [ { url: '/api/v1' } ],
  paths: {}
};

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
