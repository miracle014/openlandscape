import express from 'express'
import bodyParser from 'body-parser'
import log4js from 'log4js'
import { allowOriginsHeaders } from './middlewares/allow-origins'
import ErrorHandler from './middlewares/errorHandler'
import CombineRouter from './routes/combineRouter'
const app = express()
const port = 80



log4js.configure('./src/config/log4js.json')
var log = log4js.getLogger("app")

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(allowOriginsHeaders)


app.use(CombineRouter)

// Start the server
app.use(bodyParser.json({limit: '500mb'}))
// Start the server
var server = app.listen(port, () => {
  server.timeout = 20000000
})

// URL Not found Handler
app.use(function (req, res, next) {
  var err = new ErrorHandler('E4041', { request: `${req.method} ${req.url}` })
  next(err)
})

// Final Error Handler
app.use(function (err, req, res, next) {
  log.error("Something went wrong:", err)
  if (process.env.STATE == "PROD") delete err.detail
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: err
  });
})

log.info(`RESTful API server started on: ${port} STATE=${process.env.STATE} :: ${__dirname}`)