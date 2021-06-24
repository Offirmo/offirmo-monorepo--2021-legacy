const massive = require('massive')

// 		"massive": "^6",

// postgres://someuser:somepassword@somehost:381/somedatabase
const connectionString = 'postgres://postgres:@localhost:32768'

massive({
	host: '127.0.0.1',
	port: 32768,
	database: 'postgres',
	user: 'postgres',
}).then(db => {
	console.log(db)
})
