import { browser } from 'webextension-polyfill-ts'

export default function send_message(msg) {
	if (!browser.tabs) return

	browser.runtime.sendMessage(msg)
}
