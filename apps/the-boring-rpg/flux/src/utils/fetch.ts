import fetch_ponyfill from 'fetch-ponyfill'

const { fetch, Request, Response, Headers } = fetch_ponyfill()

export default fetch
export {
	fetch,
	Request,
	Response,
	Headers,
}
