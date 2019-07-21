import { browser } from 'webextension-polyfill-ts'

export default function send_message(msg) {
	if (!browser.tabs) {
		return void console.warn('sendmessage n/a')
	}

	console.log('📤 sendmessage', { msg })
	browser.runtime.sendMessage(msg)
}
