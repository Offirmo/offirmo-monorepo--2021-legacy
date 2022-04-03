import assert from 'tiny-invariant'
import { browser, Tabs } from 'webextension-polyfill-ts'
import { Immutable } from '@offirmo-private/ts-types'

import {UNKNOWN_ORIGIN} from '../common/consts'
import { is_origin_eligible } from '../common/state/origin'

export function query_active_tab(): Promise<Readonly<Tabs.Tab>> {
	return browser.tabs.query({active: true, currentWindow: true})
		.then(([active_tab, ...other_tabs]: Tabs.Tab[]) => {
			if (!active_tab) {
				console.error(`
Please do not manually reload the extension background tab!
Please use the reload button in the extension UI instead!
`)
				assert(active_tab, 'query_active_tab()')
			}

			assert(active_tab.id, 'query_active_tab(): tab id') // typings seems to imply it could be undef

			return active_tab
		})
}



export function get_origin(url: string): string {
	if (url === UNKNOWN_ORIGIN)
		return UNKNOWN_ORIGIN

	try {
		const origin = (new URL(url)).origin || UNKNOWN_ORIGIN

		if (!is_origin_eligible(origin))
			return UNKNOWN_ORIGIN

		return origin
	}
	catch {
		return UNKNOWN_ORIGIN
	}
}
