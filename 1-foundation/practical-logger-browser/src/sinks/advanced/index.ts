import { LogSink } from '@offirmo/practical-logger-interface'

import sink_firefox from './firefox'
import sink_chromium from './chromium'
import sink_safari from './safari'


function quick_detect_browser() {
	// https://stackoverflow.com/a/9851769/587407

	// @ts-ignore
	if (typeof InstallTrigger !== 'undefined')
		return 'firefox'

	if (!(window as any).chrome)
		return 'safari'

	return 'chromium'
}

export function create(): LogSink {
	switch(quick_detect_browser()) {
	case 'firefox':
		return sink_firefox
	case 'safari':
		return sink_safari
	default:
		return sink_chromium
	}
}
