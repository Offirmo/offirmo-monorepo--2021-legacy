import { Immutable } from '@offirmo-private/ts-types'
import memoize_one from 'memoize-one'
import getGlobalThis from '@offirmo/globalthis-ponyfill'

import { State } from './types'

////////////////////////////////////

// conservative
export function is_browser_connected_to_a_network(): boolean {
	/* https://devdocs.io/dom/navigatoronline/online
	 * while you can assume that the browser is offline when [this] returns a false value,
	 * you cannot assume that a true value necessarily means that the browser can access the internet.
	 * You could be getting false positives
	 */
	if (getGlobalThis().navigator?.onLine === false)
		return false

	return true
}

// conservative
export function is_browser_page_visible(): boolean {
	if (getGlobalThis().document.visibilityState === 'hidden')
		return false

	return true
}

export function has_data_not_synced_with_the_cloud(state: Immutable<State>): boolean {
	return Object.keys(state.cloud_sync_state).some(k => !state.cloud_sync_state[k])
}


////////////////////////////////////


const get_date_formatter = memoize_one(function _get_date_formatter(): (date_tms: number) => string {
	const intl_date_formatter = new Intl.DateTimeFormat(undefined, {
		dateStyle: 'short',
		timeStyle: 'long',
		hourCycle: 'h23',
	} as any)

	function format(date_tms: number): string {
		const date = new Date(date_tms)
		const _parts = intl_date_formatter.formatToParts(date)
		const parts = Object.fromEntries(_parts.map(({type, value}) => [ type, value ]))
		return [
			parts.timeZoneName,
			[parts.year, parts.month, parts.day].join('/'),
			[parts.hour, parts.minute, parts.second].join(':'),
		].join(' ')
	}

	return format
})


export function render(state: Immutable<State>): string {
	const lines = []
	console.log(state)

	lines.push('Current shared state:')
	lines.push('- has network: ' + is_browser_connected_to_a_network())
	lines.push('- is visible: ' + is_browser_page_visible())
	lines.push('- data sync: ' + Object.keys(state.cloud_sync_state)
		.map(id => `${id}${state.cloud_sync_state[id] ? '✅' : '❌'}`)
		.join(',')
	)

	lines.push('Log:')
	const reversed_logs = [] as string[]
	const format_date = get_date_formatter()
	state.log.forEach(log_entry => {
		reversed_logs.unshift('► ' + [
			format_date(log_entry.date),
			log_entry.text
		].join(' ► '))
	})
	lines.push(...reversed_logs)
	// ⚡
	//  ☐ ☑ ★ ⚠
	// ≡ ☠
	// ☹ ☺
	//var log = document.getElementById("log");	//     log.insertAdjacentHTML("beforeend", "Event: " + event.type + "; Status: " + condition);
	return lines.join('\n')
}
