const Cart = require('../../lib/cart')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
   async index(request, response){
      try{
	 let { cart } = request.session
	 console.log(cart)

	 cart = Cart.init(cart)

	 return response.render('cart/index', { cart })


      }catch(err){
	 console.error(err)
      }
   },
   async addOne(request, response){
      try{
	 const { id } = request.params

	 const product = await LoadProductService.load('product', {where: {id}})

	 let { cart } = request.session 

	 request.session.cart = Cart.init(cart).addOne(product)

	 return response.redirect('/cart')
      }catch(err){
	 return response.render('cart/index', {
	    error: "Error ao adicionar um produto"
	 })
      }
   }
}
