const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

require('dotenv').config({
  path: path.join(__dirname, '../.env')
})

// Set the view stuff
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use('/static', express.static(path.join(__dirname, '../static')))
app.use(bodyParser.json())

const api = new (require('./api/v1/Router.js'))(process.env)
app.use(api.path, api.router) // donc là, on appelle le router qu'on a fait sous Router.js, c'est lui qui va s'occupé de tout le reste.

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.listen(process.env.PORT, function () {
  console.log(`Server listening on ${process.env.PORT}`)
})
