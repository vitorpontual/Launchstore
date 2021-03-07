const express = require('express')
const routes = express.Router()

const OrderController = require('../app/controllers/OrderController')

const { onlyUsers } = require('../app/middleware/session')

routes.get('/', onlyUsers, OrderController.index)
   .get('/sales', onlyUsers, OrderController.sales)

routes.post('/', onlyUsers, OrderController.post)

module.exports = routes
