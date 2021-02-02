const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController.js')
const UserController = require('../app/controllers/UserController.js')
const OrderController = require('../app/controllers/OrderController.js')

const UserValidator = require('../app/validators/user.js')
const SessionValidator = require('../app/validators/session.js')

const { isLogged, onlyUsers }= require('../app/middleware/session')

// login/logout
routes.get('/login', isLogged, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)
// reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

// user register
routes.get('/register', UserController.registerForm)
routes.post('/register',UserValidator.post, UserController.post)
// user
routes.get('/', onlyUsers, UserValidator.show, UserController.show)
routes.put('/',UserValidator.put, UserController.put)
routes.delete('/', UserController.delete)

routes.get('/ads', UserController.ads)

routes.post('/orders',onlyUsers, OrderController.post)

module.exports = routes
