import { createServer } from 'http'
import * as express from 'express'

console.log('Hello world from express server!')

const PORT = process.env.PORT || 5000

const app = express()

// https://expressjs.com/en/4x/api.html#app.settings.table
app.enable('trust proxy')
app.disable('x-powered-by')


// https://expressjs.com/en/starter/static-files.html
// REM: respond with index.html when a GET request is made to the homepage
app.use(express.static('public'))

// respond with "hello world" when a GET request is made to this path
app.get('/hello', function (req, res) {
	res.send('hello world!')
})

const server = createServer(app)

server.on('error', (err: Error) => {
	console.error('something bad happened', err)
})

server.listen(PORT, () => {
	console.info(`server is listening on ${PORT}`)
})
