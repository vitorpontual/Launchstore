const Cart = require('../../lib/cart')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
	async index(request, response) {
		try {
			let { cart } = request.session
			console.log(cart)

			cart = Cart.init(cart)

			return response.render('cart/index', { cart })


		} catch (err) {
			console.error(err)
		}
	},
	async addOne(request, response) {
		try {
			const { id } = request.params

			const product = await LoadProductService.load('product', { where: { id } })

			let { cart } = request.session

			request.session.cart = Cart.init(cart).addOne(product)

			return response.redirect('/cart')
		} catch (err) {
			console.error(err)
		}
	},
	async removeOne(request, response) {
		try {

			let { id } = request.params

			let { cart } = request.session

			if (!cart) {
				return response.redirect("/cart")
			}

			request.session.cart = Cart.init(cart).removeOne(id)

			return response.redirect('/cart')


		} catch (err) {
			console.error(err)
		}
	},
	async delete(request, response) {
		try {
			let { id } = request.params

			let { cart } = request.session

			if (!cart) {
				return response.redirect('/cart')
			}

			request.session.cart = Cart.init(cart).delete(id)

			return response.redirect('/cart')
		} catch (err) {
			console.error(err)
		}
	}
}
