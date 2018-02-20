"use strict";

const BASE_ROUTE = PUBLIC_PATH

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
