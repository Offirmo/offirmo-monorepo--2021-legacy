
export function install(shouldOverwrite = false) {
	if (window._debug && !shouldOverwrite) return

	// https://devdocs.io/javascript/global_objects/proxy
	const handler = {
		get(obj, prop) {
			return () => {}
			// return console[prop] || (() => {})
		}
	}

	window._debug = {
		getLogLevel() { return [ 100, 'fatal' ] },
		getLogger() {
			return new Proxy({}, handler)
		},
		addCommand() {
			// nothing
		}
	}
}

export default install

install()
