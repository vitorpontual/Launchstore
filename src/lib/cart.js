const { formatPrice } = require('./utils')
const Cart = {
   init(oldCart){
      if(oldCart){
	 this.items = oldCart.items
	 this.total = oldCart.total
      } else {
	 this.items = []
	 this.total = {
	    quantity: 0,
	    price: 0,
	    formattedPrice: formatPrice(0)
	 }
      }
      return this
   },
   addOne(product){
      let inCart = this.items.find(item => item.product.id == product.id)

      if(!inCart){
	 inCart = {
	    product: {
	       ...product,
	       formattedPrice: formatPrice(product.price)
	    },
	    quantity: 0,
	    price: 0,
	    formattedPrice: formatPrice(0)
	 }

	 this.items.push(inCart)
      }

      if(inCart.quantity  >= product.quantity) return this
      
      // Update Item
      inCart.quantity++
      inCart.price = inCart.product.price * inCart.quantity
      inCart.formattedPrice = formatPrice(inCart.price)
      // Update Cart
      this.total.quantity++
      this.total.price += inCart.product.price
      this.total.formattedPrice = formatPrice(this.total.price)

      return this
   },
   removeOne(productId){},
   delete(productId){}
}

const product = {
   id : 1,
   price : 199,
   quantity: 2
}

const product2 = {
   id: 2,
   price: 299,
   quantity: 1
}

console.log('add first cart item')
let oldCart = Cart.init().addOne(product)
console.log(oldCart)

console.log('add second cart item')
oldCart = Cart.init(oldCart).addOne(product)
console.log(oldCart)

console.log('add third cart item')
oldCart = Cart.init(oldCart).addOne(product2)
console.log(oldCart)


console.log('add last cart item')
oldCart = Cart.init(oldCart).addOne(product)
console.log(oldCart)

module.exports = Cart
