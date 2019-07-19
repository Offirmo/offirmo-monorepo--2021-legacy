import assert from 'tiny-invariant'
import { browser, Tabs } from 'webextension-polyfill-ts'

export function query_active_tab(): Promise<Readonly<Tabs.Tab>> {
	return browser.tabs.query({active: true, currentWindow: true})
		.then(([active_tab, ...other_tabs]: Tabs.Tab[]) => {
			assert(active_tab.id, 'query_active_tab(): tab id') // typings seems to imply it could be undef
			return active_tab
		})
}
