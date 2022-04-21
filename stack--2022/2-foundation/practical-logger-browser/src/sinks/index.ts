import { LogSink } from '@offirmo/practical-logger-types'

import { Browser, SinkOptions } from '../types'
import sink_firefox from './advanced/firefox'
import sink_chromium from './advanced/chromium'
import sink_safari from './advanced/safari'
import create_sink_no_css from './no-css'

// TODO export that?
function quick_detect_browser(): Browser {
	// https://stackoverflow.com/a/9851769/587407
	// https://dev.to/_elmahdim/safe-reliable-browser-sniffing-39bp

	try {
		if ((window as any).InstallTrigger)
			return 'firefox'

		if ((window as any).ApplePaySession)
			return 'safari'

		if ((window as any).chrome)
			return 'chromium'
	}
	catch {
		/* ignore */
	}

	return 'other'
}


export function create(options: Readonly<SinkOptions> = {}): LogSink {
	if (options.useCss === false)
		return create_sink_no_css(options)

	switch(options.explicitBrowser || quick_detect_browser()) {
		case 'firefox':
			return sink_firefox
		case 'safari':
			return sink_safari
		case 'chromium':
			return sink_chromium
		default:
			return create_sink_no_css(options)
	}
}
