"use strict";

// auto-detect basename, correctly ignoring dynamic routes
const BASE_ROUTE = (pathname => {
	// stable point, everything after is likely to be a route
	const TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER = WI_BASE_PATH

	const splitted = pathname.split(TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER)
	const parent_segment = splitted[0]
	let base_route = parent_segment + TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER

	// special dev/staging case where we are served under an additional /dist
	if (splitted[1].startsWith('/dist'))
		base_route += '/dist'

	return base_route
})(window.location.pathname)

const ROUTES = {
	// special routes
	index: '/index.html', // technical route for redirection

	// navigable routes
	home: '/index.html',
	inventory: '/inventory',
	character: '/character',
	about: '/about',

	// non-navigable routes
	export_savegame: '/savegame',
	x: '/x',
}

export {
	BASE_ROUTE,
	ROUTES,
}

// TODO cleanup
