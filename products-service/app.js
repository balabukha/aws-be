const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const openApiDoc = require('./openapi.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));

app.listen(8000,() => {
  console.log('Swagger at http://localhost:8000/api-docs');
});
