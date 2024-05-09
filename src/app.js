const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()
const mongoose = require('./api/v1/databases/init.mongodb.js')
const router = express.Router();
const { route } = require('./api/v1/routes/index.js')


// Swagger UI
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')
const css = fs.readFileSync(
  path.resolve(__dirname, '../node_modules/swagger-ui-dist/swagger-ui.css'),
  'utf8'
);
require('./api/v1/public/js/swagger-ui-bundle.min');
require('./api/v1/public/js/swagger-ui-standalone-preset.min');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = yaml.parse(fs.readFileSync(path.resolve(__dirname, './api/v1/docs/swagger.yaml'), 'utf8'))

// require enviroment  from .env
require('dotenv').config()


// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss:
      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: css,
  }),
);
// init db
mongoose

// init routes
app.use('/', require('./api/v1/routes/index.js'));


module.exports = app
