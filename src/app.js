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
// CDN CSS

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

require('./api/v1/public/js/swagger-ui-bundle.min');
require('./api/v1/public/js/swagger-ui-standalone-preset.min');
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
var SwaggerUIBundle = require('swagger-ui-dist').SwaggerUIBundle
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

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
      termsOfService: "http://example.com/terms/",
      contact: {
        name: "API Support",
        url: "http://www.exmaple.com/support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "https://nodejs-swagger-api.vercel.app/",
        description: "My API Documentation",
      },
    ],
  },
  // This is to call all the file
  apis: ["src/**/*.js"],
};

const specs = swaggerJsDoc(options);

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { customCssUrl: CSS_URL })
);
// init db
mongoose

// init routes
app.use('/', require('./api/v1/routes/index.js'));


module.exports = app
