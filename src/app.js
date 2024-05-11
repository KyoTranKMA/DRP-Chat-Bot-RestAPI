const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()
const mongoose = require('./api/v1/databases/init.mongodb.js')
const { route } = require('./api/v1/routes/index.js')

// Swagger UI libs
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
// get swagger document
const swaggerDocument = yaml.parse(fs.readFileSync(path.resolve(__dirname, './api/v1/public/swagger.yaml'), 'utf8'))
const swaggerUiAsset = require("swagger-ui-dist")
// CDN CSS URL
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





// home page route
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, './api/v1/public/homepage.html'));
});
// docs api routes
app.use('/docs', swaggerUi.serve);
app.use('/docs', express.static(swaggerUiAsset.getAbsoluteFSPath()));
app.get('/docs', swaggerUi.setup(swaggerDocument, { customCssUrl: CSS_URL }));

// init db
mongoose
// init routes
app.use('/', require('./api/v1/routes/index.js'));


module.exports = app
