import { createServer } from 'http'

import express from 'express'

import { BUILD_DATE, VERSION } from './build'

console.log('Hello world from Typescript express server!')


////////////////////////////////////

const app = express()

// https://expressjs.com/en/4x/api.html#app.settings.table
app.enable('trust proxy')
app.disable('x-powered-by')

// respond with "hello world" when a GET request is made to this path
app.get('/', function (req, res) {
	res.send(`
This is not what you’re looking for.<br />
<hr>
node: v${process.versions.node}<br />
code: v${VERSION}<br />
build: ${BUILD_DATE}<br />
now: ${+(new Date())}
`)
})

// monitoring badges https://shields.io/endpoint
const BADGE_BODY = {
	"schemaVersion": 1,
	"label": "TODO label",
	"message": "TODO message",
	//"color": "orange",
	"isError": false,
	//"namedLogo": "foo",
}
app.get('/badges/time', function (req, res) {
	res.send({
		...BADGE_BODY,
		label: 'build date',
		message: BUILD_DATE,
	})
})
app.get('/badges/version', function (req, res) {
	res.send({
		...BADGE_BODY,
		label: 'version',
		message: VERSION,
	})
})

////////////////////////////////////

const server = createServer(app)

server.on('error', (err: Error) => {
	console.error('server encountered an error', err)
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
	console.info(`server is listening on ${PORT}`)
})
