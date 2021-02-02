const { unlinkSync } = require('fs')

const Category = require('../models/Category.js')
const Product = require('../models/Product.js')
const File = require('../models/File.js')
const LoadProductService = require('../services/LoadProductService')

const { formatPrice, date } = require('../../lib/utils.js')


module.exports = {
   async create(req, res) {
      try{
	 const categories = await Category.findAll()

         return res.render('products/create', { categories })
      }catch(err){
	 console.error(err)
      }
   },

   async post(req, res) {
      try{

	 let { category_id, name, description, old_price, price, quantity, status } = req.body

	 price = price.replace(/\D/g, "")

	 const product_id = await Product.create({
	    category_id, 
	    user_id: req.session.userId,
	    name, 
	    description, 
	    old_price: old_price || price, 
	    price, 
	    quantity, 
	    status: status || 1 
	 })

	 const filesPromise = req.files.map(file => File.create({ name: file.filename, path: file.path, product_id}))
	 await Promise.all(filesPromise)

	 return res.redirect(`/products/${product_id}/edit`)
      }catch(err){
	 console.error(err)
      }
   },
   async show(req, res){
      try{
	 const product = await LoadProductService.load('product', {
	    where: {
	       id: req.params.id
	    }
	 })

	 if(!product) return res.send('Product not found!')


	 return res.render('products/show', { product, files: product.files})

      }catch(err){
	 console.error(err)
      }

   },
   async edit(req, res) {
      try{
	 const product = await LoadProductService.load('product', {
	    where: {
	       id: req.params.id
	    }
	 })

	 // get categories
	 const categories = await Category.findAll()

	 return res.render('products/edit', { product, categories, files: product.files })

      }catch(err){
	 console.error(err)
      }
   },

   async put(req, res) {
      try{
	 if (req.files.length != 0) {
	    const newFilesPromise = req.files.map(file => {
	       File.create({ name: file.filename, path: file.path, product_id: req.body.id })
	    })

	    await Promise.all(newFilesPromise)
	 }

	 if (req.body.removed_files) {
	    const removedFiles = req.body.removed_files.split(',')
	    const lastIndex = removedFiles.length - 1
	    removedFiles.splice(lastIndex, 1)
	    
	    const removedFilesPromise = removedFiles.map(async id => {
	       const file = await File.find(id)
	       try{
		  unlinkSync(file.path)
	       }catch(err){
		  console.error(err)
	       }
	       await File.delete(id)
	    })
	 }
	 req.body.price = req.body.price.replace(/\D/g, "")

	 if (req.body.old_price != req.body.price) {
	    const oldProduct = await Product.find(req.body.id)
	    req.body.old_price = oldProduct.price
	 }


	 await Product.update(req.body.id, {
	    category_id: req.body.category_id,
	    name: req.body.name,
	    description: req.body.description,
	    old_price: req.body.old_price,
	    price: req.body.price,
	    quantity: req.body.quantity,
	    status: req.body.status,

	 })

	 return res.redirect(`/products/${req.body.id}`)
      }catch(err){
	 console.error(err)
      }
   },
    
   async delete(req, res) {

      await Product.delete(req.body.id)
      // Pegar todas as imagens
      const files = await Product.files(req.body.id)

      files.map(file => {
	 try{
	    unlinkSync(file.path)
	 }catch(err){
	    console.error(err)
	 }
      })


      return res.redirect('/products/create')
   }
}
