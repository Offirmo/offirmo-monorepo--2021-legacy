import { Tab } from '../common/types'

export function query_active_tab(): Promise<Readonly<Tab>> {
	return new Promise(resolve => {
		chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			resolve(tabs[0])
		})
	})
}
