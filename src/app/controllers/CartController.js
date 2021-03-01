const Cart = require('../../lib/cart')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
   async index(request, response){
      try{
	 const product = await LoadProductService.load('product', {where: { id: 5 }})
	 let { cart } = request.session

	 cart = Cart.init(cart).addOne(product)
	 return response.render('cart/index', {cart})

      }catch(err){
	 console.error(err)
      }
   }
}
