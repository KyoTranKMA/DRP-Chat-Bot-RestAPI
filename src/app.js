const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()
const mongoose = require('./api/v1/databases/init.mongodb.js')
const { route } = require('./api/v1/routes/index.js')


// Swagger UI
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
var SwaggerUIBundle = require('swagger-ui-dist').SwaggerUIBundle
const swaggerDocument = yaml.parse(fs.readFileSync(path.resolve(__dirname, './api/v1/docs/swagger.yaml'), 'utf8'))
// CDN CSS

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";




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
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customCssUrl: CSS_URL })
);
// init db
mongoose

// init routes
app.use('/', require('./api/v1/routes/index.js'));


module.exports = app
