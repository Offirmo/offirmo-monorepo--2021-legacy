const pg = require('pg')
const massive = require('massive')

// https://github.com/dmfay/massive-js/issues/262
// reseting massive is complex https://gitlab.com/dmfay/massive-js/blob/master/test/helpers/index.js
// so better use pg to create the tables, then massive
pg.connect("postgres://postgres:password@localhost/excel", function(err, client, done){
	client.query("CREATE TABLE IF NOT EXISTS revenue(id serial primary key, \"Date\" integer, \"Account Name\" varchar(255) not null, \"Total Sold Imps\" integer, \"Imps Bought\" integer, \"Publisher Rev\" numeric)")
	done()
})


// postgres://someuser:somepassword@somehost:381/somedatabase
const connectionString = 'postgres://postgres:@localhost:32768'
const connectionDetails =

let db = massive.connectSync(connectionDetails)

db.runSync(`
CREATE TABLE IF NOT EXISTS revenue(
id serial primary key,
\"Date\" integer,
\"Account Name\" varchar(255) not null,
\"Total Sold Imps\" integer,
\"Imps Bought\" integer,
\"Publisher Rev\" numeric
)`)

