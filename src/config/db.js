const { Pool } = require('pg')

module.exports = new Pool({
   user: 'vpguedes',
   password: '123qwe123',
   local: "localhost",
   port: 5432,
   database: "launchstoredb"
})


