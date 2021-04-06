import { createServer } from 'http'

import express from 'express'

import { BUILD_DATE } from './build'

console.log('Hello world from Typescript express server!')

const PORT = process.env.PORT || 5000

const app = express()

// https://expressjs.com/en/4x/api.html#app.settings.table
app.enable('trust proxy')
app.disable('x-powered-by')

// respond with "hello world" when a GET request is made to this path
app.get('/', function (req, res) {
	res.send(`
This is not what you’re looking for.<br />
node: v${process.versions.node}<br />
build: ${BUILD_DATE}<br />
now: ${+(new Date())}
`)
})

const server = createServer(app)

server.on('error', (err: Error) => {
	console.error('server encountered an error', err)
})

server.listen(PORT, () => {
	console.info(`server is listening on ${PORT}`)
})
