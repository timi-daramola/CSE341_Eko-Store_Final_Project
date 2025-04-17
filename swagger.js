const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Eko Store API',
      version: '1.0.0',
      description: 'API documentation for the Eko Store project',
    },
    servers: [
      {
        url: 'https://cse341-eko-store-final-project.onrender.com/', // Replace with your server URL
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };