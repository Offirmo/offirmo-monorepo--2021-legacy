import assert from 'tiny-invariant'
import { browser } from "webextension-polyfill-ts"
import { Tab } from '../common/types'

export function query_active_tab(): Promise<Readonly<Tab>> {
	return browser.tabs.query({active: true, currentWindow: true})
		.then(([active_tab, ...other_tabs]: Tab[]) => {
			assert(active_tab.id, 'tab id') // typings seems to imply it could be undef
			return active_tab
		})
}
