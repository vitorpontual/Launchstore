const express = require('express')
const routes = express.Router()

const OrderController = require('../app/controllers/OrderController')

const { onlyUser } = require('../app/middleware/session')

routes.post('/', OrderController.post)

module.exports = routes
