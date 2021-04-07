'use strict'

import logger from './logger'

// auto-detect basename, correctly ignoring dynamic routes
export function get_base_route() {
	const pathname = window.location.pathname

	//console.log(`computing BASE_ROUTE from pathname = "${pathname}"…`)
	// stable point, everything after is likely to be a route
	const TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER = (() => {
		if (pathname.includes('/the-boring-rpg/client--browser'))
			return '/the-boring-rpg/client--browser' // when served by GitHub = "dev+" setup + netlify

		if (pathname.includes('/the-boring-rpg-preprod'))
			return '/the-boring-rpg-preprod'

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

	logger.verbose(`BASE_ROUTE = "${base_route}"`)

	return base_route
}

export const ROUTES = {
	// special routes
	index: '/index-2.html', // technical route for redirection TODO auto from current file?

	// navigable routes
	home: '/index-2.html',
	savegame: '/savegame',
	dev: '/dev',
	diagnostic: '/diag',
	x: '/x',
}
