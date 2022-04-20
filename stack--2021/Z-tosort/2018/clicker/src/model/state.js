import memoizeOne from 'memoize-one'
import { get_UTC_timestamp_ms as get_UTC_timestamp_ms_orig, get_human_readable_UTC_timestamp_minutes } from '@offirmo/timestamps'
import { generate_uuid } from '@offirmo/uuid'

import {
	CLICK_ENHANCERS,
		AUTO_CLICK_ENHANCERS,
} from './data'

////////////////////////////////
function get_UTC_timestamp_ms({DEBUG = true} = {}) {
	if (DEBUG) console.log('get_UTC_timestamp_ms')

	return get_UTC_timestamp_ms_orig()
}

function precompute_unmemoized(stable, DEBUG = true) {
	if (DEBUG) console.log('precompute_unmemoized')

	let extras_per_clicks = 0
	let autoclicks_per_s = 0

	CLICK_ENHANCERS.forEach(CE => {
		const own_upgrade = !!stable.bought_upgrades[CE.id]
		if (own_upgrade)
			extras_per_clicks += CE.extras_per_clicks
	})

	AUTO_CLICK_ENHANCERS.forEach(ACE => {
		const own_upgrade = !!stable.bought_upgrades[ACE.id]
		if (own_upgrade)
			autoclicks_per_s += ACE.click_per_s_added
	})

	return {
		extras_per_clicks,
		autoclicks_per_s,
	}
}
const precompute = memoizeOne(precompute_unmemoized)

function get_snapshot_updated_to_now({ stable, snapshot }, {DEBUG = true, now_ms = get_UTC_timestamp_ms()} = {}) {
	if (DEBUG) console.log('get_snapshot_updated_to_now', now_ms)

	const { autoclicks_per_s } = precompute(stable, DEBUG)

	let elapsed_time_ms = now_ms - snapshot.date_ms
	if (elapsed_time_ms > 0) { // ignore any strange clock manipulation / daylight saving
		snapshot = {
			...snapshot,
			date_ms: snapshot.date_ms + elapsed_time_ms,
			wasted_ideas_x1000: snapshot.wasted_ideas_x1000 + elapsed_time_ms * autoclicks_per_s,
		}
	}

	return snapshot
}

///////////////////////////////

function create({DEBUG = true, now_ms} = {}) {
	if (DEBUG) console.group('create')
	now_ms = now_ms || get_UTC_timestamp_ms({DEBUG})
	if (DEBUG) console.log({now_ms})

	const new_state = {
		stable: {
			uuid: generate_uuid(),
			creation_date: get_human_readable_UTC_timestamp_minutes(),
			interaction_count: 0,
			click_count: 0, // click as in clicker
			bought_upgrades: [],
		},
		snapshot: {
			date_ms: now_ms,
			wasted_ideas_x1000: 0,
		}
	}

	if (DEBUG) console.log('created state:', new_state)
	if (DEBUG) console.groupEnd()

	return new_state
}


function click(state, {DEBUG = true, now_ms} = {}) {
	if (DEBUG) console.group('click')
	now_ms = now_ms || get_UTC_timestamp_ms({DEBUG})
	if (DEBUG) console.log({now_ms})
	if (DEBUG) console.log('state before:', state)

	let { stable } = state

	// critical to incur gains with previous stable
	// before altering it
	const snapshot = get_snapshot_updated_to_now(state, {DEBUG, now_ms})

	// we can now change the state
	const interaction_count = stable.interaction_count + 1
	const click_count = stable.click_count + 1
	stable = {
		...stable,
		interaction_count,
		click_count,
	}

	// update snapshot with click effect
	const { extras_per_clicks } = precompute(stable, DEBUG)
	snapshot.wasted_ideas_x1000 = snapshot.wasted_ideas_x1000 + (1 + extras_per_clicks) * 1000

	const new_state = {
		stable,
		snapshot,
	}

	if (DEBUG) console.log('state after:', new_state)
	if (DEBUG) console.groupEnd()
	return new_state
}


function update(state, {DEBUG = true, now_ms} = {}) {
	if (DEBUG) console.group('update')
	now_ms = now_ms || get_UTC_timestamp_ms({DEBUG})
	if (DEBUG) console.log({now_ms})
	if (DEBUG) console.log('state before:', state)


	const snapshot = get_snapshot_updated_to_now(state, {DEBUG, now_ms})

	const new_state = {
		...state,
		snapshot,
	}

	if (DEBUG) console.log('state after:', new_state)
	if (DEBUG) console.groupEnd()
	return new_state
}


function buy(state, augmentation_id, {DEBUG = true, now_ms} = {}) {
	if (DEBUG) console.group('buy')
	now_ms = now_ms || get_UTC_timestamp_ms({DEBUG})
	if (DEBUG) console.log({augmentation_id, now_ms})
	if (DEBUG) console.log('state before:', state)

	// critical to incur gains with previous stable
	// before altering it
	const snapshot = get_snapshot_updated_to_now(state, {DEBUG, now_ms})

	// we can now change the state
	// TODO

	const new_state = {
		...state,
		snapshot,
	}

	if (DEBUG) console.log('state after:', new_state)
	if (DEBUG) console.groupEnd()
	return new_state
}


export {
	precompute,
	create,
	click,
	update,
	buy,
}
