// https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#caching_static_html


const CACHE_NAME = 'tbrpg'
const ACTIVATION_DATE = Date.now()
setTimeout(() => console.info('service worker', { location }), 15000)

console.log('[ServiceWorker] hello', { self, activation_date: ACTIVATION_DATE })

self.addEventListener('install', (event) => {
	console.log('[ServiceWorker] ⚡️install', { event })

	// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
	/*
	While self.skipWaiting() can be called at any point during the service worker's execution,
	it will only have an effect if there's a newly installed service worker
	that might otherwise remain in the waiting state.
	Therefore, it's common to call self.skipWaiting() from inside of an InstallEvent handler.

	The following example causes a newly installed service worker to progress into the activating state,
	regardless of whether there is already an active service worker.

	NOTES: also useful in dev if 2x tabs
	 */
	self.skipWaiting()
})

self.addEventListener('activate', (event) => {
	/* activate event
	The point where this event fires is generally a good time
	to clean up old caches and other things associated with
	the previous version of your service worker.
	 */
	console.log('[ServiceWorker] ⚡️activate', { request: event.request, event })

	// https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim
	event.waitUntil(clients.claim());
})

function normalize_url(url: string) {
	// Optional: Normalize the incoming URL by removing query parameters.
	// Instead of https://example.com/page?key=value,
	// use https://example.com/page when reading and writing to the cache.
	// For static HTML documents, it's unlikely your query parameters will
	// affect the HTML returned. But if you do use query parameters that
	// uniquely determine your HTML, modify this code to retain them.
	return new URL(url)
}

self.addEventListener('fetch', (event: FetchEventInit) => {
	const { request } = event
	const url = new URL(request.url)
	console.group('[ServiceWorker] ⚡️fetch', event.request.mode, url.pathname)
	console.log({ event, request, url })

	// https://www.smashingmagazine.com/2016/02/making-a-service-worker/

	// stale-while-revalidate
	const normalized_url = normalize_url(event.request.url)
	console.log({ normalized_url })

	event.respondWith(async function() {
		// Create promises for both the network response,
		// and a copy of the response that can be used in the cache.
		const ↆfetch_response = fetch(normalized_url)
		const ↆfetch_response_clone = ↆfetch_response.then(r => r.clone())
		// TODO don't cache bad responses!

		// event.waitUntil() ensures that the service worker is kept alive
		// long enough to complete the cache update.
		event.waitUntil(async function() {
			const cache = await caches.open(CACHE_NAME);
			await cache.put(normalized_url, await ↆfetch_response_clone)
		}())

		// Prefer the cached response, falling back to the fetch response.
		return (await caches.match(normalized_url)) || ↆfetch_response
	}())



	// serve the cat SVG from the cache if the request is
		// same-origin and the path is '/dog.svg'
		/*if (url.origin == location.origin && url.pathname == '/dog.svg') {
			event.respondWith(caches.match('/cat.svg'));
		}*/


	console.groupEnd()
})
