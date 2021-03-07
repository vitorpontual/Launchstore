const express = require('express')
const routes = express.Router()

const OrderController = require('../app/controllers/OrderController')

const { onlyUsers } = require('../app/middleware/session')

routes.get('/', onlyUsers, OrderController.index)
   .get('/sales', onlyUsers, OrderController.sales)
   .get('/:id', onlyUsers, OrderController.show)



routes.post('/', onlyUsers, OrderController.post)
   .post('/:id/:action', onlyUsers, OrderController.update)

module.exports = routes
