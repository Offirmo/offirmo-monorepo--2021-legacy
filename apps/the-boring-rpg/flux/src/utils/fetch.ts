import fetch_ponyfill from 'fetch-ponyfill'

const { fetch, Request, Response, Headers } = fetch_ponyfill()

console.log({
	fetch, Request, Response, Headers
})

export default fetch
export {
	fetch,
	Request,
	Response,
	Headers,
}
