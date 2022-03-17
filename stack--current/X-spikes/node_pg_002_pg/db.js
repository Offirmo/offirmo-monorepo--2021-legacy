const { Client } = require('pg')

export const config = {
	host: '127.0.0.1',
	port: 32768,
	database: 'postgres',
	user: 'postgres',
}

const client = new Client(config)


export default function get_db() {
	return
	client
		.connect()
		.then(() => console.log('connected'))
		.catch(e => console.error('connection error', err.stack))
}
