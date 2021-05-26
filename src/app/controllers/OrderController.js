const LoadProductService = require('../services/LoadProductService')
const LoadOrderService = require('../services/LoadOrderService')
const User = require('../models/User')
const Order = require('../models/Order')
const Product = require("../models/Product")

const mailer = require('../../lib/mailer')
const Cart = require('../../lib/cart')

const email = (seller, product, buyer) => `
<h2>Olá ${seller.name}</h2>
<p>Você tem um novo pedido de compra do seu produto</p>
<p>Produto: ${product.name}</p>
<p>Preço: ${product.formattedPrice}</p>
<p><br /><br /></p>
<h3>Dados do Comprador</h3>
<p>${buyer.name}</p>
<p>${buyer.email}</p>
<p>${buyer.address}</p>
<p>${buyer.cep}</p>
<p><br /><br /></p>
<p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
<p><br />
<br />
</p>
<p>Atenciosamente, Equipe Launchstore</p>
`

module.exports = {
	async index(req, res) {
		const orders = await LoadOrderService.load('orders', {
			where: { buyer_id: req.session.userId }
		})

		return res.render('orders/index', { orders })
	},
	async sales(req, res) {
		const sales = await LoadOrderService.load('orders', {
			where: { seller_id: req.session.userId }
		})

		return res.render('orders/sales', { sales })
	},
	async show(req, res) {
		try {
			const order = await LoadOrderService.load('order', {
				where: { id: req.params.id }
			})

			return res.render('orders/detail', { order })
		} catch (err) {
			console.error(err)
		}
	},
	async post(req, res) {
		try {
			const cart = Cart.init(req.session.cart)

			const buyer_id = req.session.userId
			const filteredItems = cart.items.filter(item =>
				item.product.user_id != buyer_id
			)

			const createOrdersPromise = filteredItems.map(async item => {
				let { product, price: total, quantity } = item
				const { price, id: product_id, user_id: seller_id, } = product
				const status = "open"

				const order = await Order.create({
					seller_id,
					buyer_id,
					product_id,
					price,
					total,
					quantity,
					status
				})
				// Get Product Data
				product = await LoadProductService.load('product', {
					where: {
						id: product_id
					}
				})
				// Get seller Data
				const seller = await User.findOne({ where: { id: seller_id } })

				// Get Buyer Data
				const buyer = await User.findOne({ where: { id: buyer_id } })

				// Send Email Buyer to Vendor
				console.log('Send Email...')
				await mailer.sendMail({
					to: seller.email,
					from: 'no-reply@launchstore.com.br',
					subject: 'Novo pedido de compra',
					html: email(seller, product, buyer)
				})

				return order
			})

			await Promise.all(createOrdersPromise)

			delete req.session.cart
			Cart.init()

			console.log('Email send Success')
			// Notify user success message
			return res.render('orders/success')


		} catch (err) {
			console.error(err)
		}
	},
	async update(req, res) {
		try {
			const { id, action } = req.params

			const acceptedActions = [
				'close', 'cancel'
			]

			// if (!acceptedActions.includes(action)) return res.send("Can't do this action")

			const order = await Order.findOne({ where: { id } })

			const product = await LoadProductService.load('product', {
				where: {
					id: order.product_id
				}
			})

			if (!order) return res.send('order not found')

			if (order.status != 'open') return res.send("Can't do this action")

			const statuses = {
				close: "sold",
				cancel: "canceled"
			}

			order.status = statuses[action]

			if (await order.status === "sold"){
				await Product.update(product.id, {
					quantity: product.quantity - order.quantity
				})
			}

			await Order.update(id, {
				status: order.status
			})

			return res.redirect('/orders/sales')

		} catch (err) {
			console.error(err)
		}
	}

}
