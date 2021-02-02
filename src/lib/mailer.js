const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "abfdd40a64ebba",
    pass: "ceb303a5999026"
  }
});

