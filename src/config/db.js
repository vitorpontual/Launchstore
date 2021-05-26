const { Pool } = require('pg')

module.exports = new Pool({
   user: 'docker',
   password: 'ignite',
   local: "localhost",
   port: 5432,
   database: "launchstoredb"
})


