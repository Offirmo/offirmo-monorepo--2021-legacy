import Raven from 'raven-js'
import { CHANNEL } from './channel'
import ensureDeviceUUID from '@offirmo/ensure-device-uuid-browser'

import { VERSION, BUILD_DATE } from './build.json'


/////////////////////////////////////////////////

const DEVICE_UUID = ensureDeviceUUID()

///////

let imminent_error = null
export function set_imminent_captured_error(err) {
	if (imminent_error) {
		console.error('set_imminent_captured_error(): previous error wasn’t handled!')
	}

	imminent_error = err
}


const error_reporter = new Raven.Client()

error_reporter
	.config('https://ac5806cad5534bcf82f23d857a1ffce5@sentry.io/1235383', {
		// https://docs.sentry.io/clients/javascript/config/
		// logger ?
		release: VERSION,
		environment: process.env.NODE_ENV, // TOCHECK
		serverName: DEVICE_UUID,
		tags: {
			//git_commit: 'c0deb10c4',
			BUILD_DATE,
			CHANNEL,
		},
		// whitelistUrls: [...],
		// ignoreErrors: [...],
		// ignoreUrls: [...],
		// includePaths: [...],
		// sampleRate:
		// sanitizeKeys:
		dataCallback: function(data) {
			//console.log('raven dataCallback(…)', data)
			// do something to data
			if (!imminent_error) {
				console.error('raven dataCallback(…): set_imminent_captured_error() wasn’t called!')
			}
			else {
				const all_details = imminent_error.details || {}
				// clean up some unneeded details, redundant with Raven or already set above
				const { ENV, CHANNEL, DEVICE_UUID, OS_NAME, BROWSER_NAME, VERSION, ...details } = all_details
				data.tags = {
					...data.tags,
					...details,
				}
				imminent_error = null
			}

			console.log('(this error has been reported)')
			return data
		},
		/*breadcrumbCallback: function(crumb) {
			console.log('raven breadcrumbCallback(…)', crumb)
			// do something to data
			return crumb
		},*/
		/*shouldSendCallback: function(data) {
			//console.log('raven shouldSendCallback(…)', data)
			return true
		},*/
		// maxMessageLength
		// maxUrlLength
		// autoBreadcrumbs
		// maxBreadcrumbs
		captureUnhandledRejections: false,
		/* transport: function (options) {
			... send data
		},*/
		// allowDuplicates
		// allowSecretKey
		//debug: true,
		//instrument:
	})
	//.install();

/*
// https://docs.sentry.io/clients/javascript/usage/#tracking-users
// TODO
Raven.setUserContext({
	email: 'matt@example.com',
	id: '123'
})
*/

/*
Raven.captureException(new Error('Oops!')

Raven.wrap({
		tags: {git_commit: 'c0deb10c4'}
	}, function () { … });

Raven.captureMessage('Test captureMessage1')
Raven.captureMessage('Test captureMessage2', {
	level: 'info' // one of 'info', 'warning', or 'error'
})

Raven.showReportDialog();
*/

export default error_reporter

export function report_error(err) {
	Raven.captureException(err)
}
