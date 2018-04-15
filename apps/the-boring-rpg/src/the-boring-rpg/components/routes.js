"use strict";

// TODO auto=adapt to current path instead
const BASE_ROUTE = (pathname => {
	const TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER = '/the-boring-rpg'
	const parent_segment = pathname.split(TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER)[0]
	return parent_segment + TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER
})(window.location.pathname)

const ROUTES = {
	// special routes
	index: '/index.html', // technical route for redirection

	// navigable routes
	home: '/',
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
