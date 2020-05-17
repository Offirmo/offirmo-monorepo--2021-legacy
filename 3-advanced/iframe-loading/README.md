
http://localhost:1981/3-advanced/iframe-loading/src/index.html?foo=bar
http://localhost:1981/3-advanced/iframe-loading/doc/demo/index.html?foo=bar

from: html5_009 : WTE micro template

TODO pass referrer?
TODO include google for correct referrer?
TODO LS?
TODO service worker?
TODO small reveal anim?
TODO copy and propagate favicons? webmanifest?
TODO remove logs


https://stackoverflow.com/questions/10282939/how-to-get-favicons-url-from-a-generic-webpage-in-javascript

`localStorage.setItem('🛠UDA.override.logger.loading-iframe.logLevel', '"silly"')`


		window.onload = (e) => console.log(`[IL] GlobalEventHandlers.onload`, e)
		window.frames[0].onload = (e) => console.log(`[IL] GlobalEventHandlers.onload 2`, e)

TODO display version

TODO preload https://developers.google.com/web/fundamentals/performance/resource-prioritization#preload
TODO preconnect https://developers.google.com/web/fundamentals/performance/resource-prioritization#preconnect
