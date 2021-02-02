const crypto = require("crypto")
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')
const User = require('../models/User')

module.exports = {
   loginForm(req, res){
      return res.render('session/login')
   },
   login(req, res){
      req.session.userId = req.user.id

      return res.redirect('/users')
   },
   logout(req, res){
      req.session.destroy()

      return res.redirect('/')
   },
   forgotForm(req, res){
      return res.render('session/forgot-password')
   },
   async forgot(req, res){
      const user = req.user
      console.log(user)
      try{
	 // um token para esse usuário
	 const token = crypto.randomBytes(20).toString("hex")
	 // criar uma expiração
	 let now = new Date()
	 now = now.setHours(now.getHours() + 1)

	 await User.update(user.id, {
	    reset_token: token,
	    reset_token_expires: now
	 })
	 // enviar um email com um link de recuperação
	 await mailer.sendMail({
	    to: user.email,
	    form: 'no-replay@launchstore.com.br',
	    subject: 'Recuperação de senha',
	    html:`
	    <h2>Perdeu a chave?</h2>
	    <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
	    <p>
	       <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
	       Recuperar senha
	       </a>
	    </p>
	    `
	 }) 
	 // avisar ao usúaro que enviamos o email
	 return res.render("session/forgot-password", {
	    sucess: "Verifique seu email para resetar a senha"
	 })
      }catch(err){
	 console.log(err)
	 return res.render("session/forgot-password", {
	    error: "Error unexpected, try again!"
	 })
      }
   },
   resetForm(req, res){
      return res.render('session/password-reset', { token: req.query.token })
   },
   async reset(req, res){
      const user = req.user
      const {password, token} = req.body
      try{
	 // Create new Hash Password
	 const newPassword = await hash(password, 8)
	 // Update User
	 await User.update(user.id, {
	    password: newPassword,
	    reset_token: "",
	    reset_token_expires: ''
	 })
	 // Notify User have new password
	 return res.render("session/login", {
	    user: req.body,
	    sucess: "Password Updated! You can Login"
	 })
      }catch(err){
	 console.log(err)
	 return res.render("session/password-reset", {
	    user: req.body,
	    token,
	    error: "Error unexpected, try again!"
	 })
      }
   }
}
