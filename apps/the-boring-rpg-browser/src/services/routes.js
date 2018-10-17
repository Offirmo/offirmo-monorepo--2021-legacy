'use strict'

// auto-detect basename, correctly ignoring dynamic routes
const BASE_ROUTE = (pathname => {
	console.log(`computing BASE_ROUTE from pathname="${pathname}"...`)
	// stable point, everything after is likely to be a route
	const TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER = (() => {
		if (pathname.includes('/the-boring-rpg-browser'))
			return '/the-boring-rpg-browser' // "dev+" setup

		if (pathname.includes('/the-boring-rpg'))
			return '/the-boring-rpg' // prod setup

		return '' // dev setup
	})()

	const splitted = pathname.split(TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER)
	const parent_segment = splitted[0]
	let base_route = parent_segment + TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER

	// special dev/staging case where we are served under an additional /dist
	if (splitted[1] && splitted[1].startsWith('/dist'))
		base_route += '/dist'

	/*console.log('BASE_ROUTE computation', {
		TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER,
		splitted,
		parent_segment,
		base_route,
	})*/

	return base_route
})(window.location.pathname)
console.log(`BASE_ROUTE="${BASE_ROUTE}"...`)


const ROUTES = {
	// special routes
	index: '/index.html', // technical route for redirection

	// navigable routes
	home: '/',
	//inventory: '/inventory',
	//character: '/character',
	//about: '/about',
	savegame: '/savegame',
	dev: '/dev',
	diagnostic: '/diag',
	x: '/x',
}

export {
	BASE_ROUTE,
	ROUTES,
}

// TODO cleanup
