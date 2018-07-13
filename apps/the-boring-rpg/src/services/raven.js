import Raven from 'raven-js'
import {CHANNEL} from './channel'
import ensureDeviceUUID from '@offirmo/device-uuid-browser'

/////////////////////////////////////////////////

const DEVICE_UUID = ensureDeviceUUID()

Raven
	.config('https://ac5806cad5534bcf82f23d857a1ffce5@sentry.io/1235383', {
		// https://docs.sentry.io/clients/javascript/config/
		// logger ?
		release: WI_VERSION,
		environment: WI_ENV,
		serverName: DEVICE_UUID,
		tags: {
			//git_commit: 'c0deb10c4',
			BUILD_DATE: WI_BUILD_DATE,
			CHANNEL,
		},
		// whitelistUrls: [...],
		// ignoreErrors: [...],
		// ignoreUrls: [...],
		// includePaths: [...],
		// sampleRate:
		// sanitizeKeys:
		dataCallback: function(data) {
			console.log('raven dataCallback(…)', data)
			// do something to data
			return data
		},
		/*breadcrumbCallback: function(crumb) {
			console.log('raven breadcrumbCallback(…)', crumb)
			// do something to data
			return crumb
		},*/
		/*shouldSendCallback: function(data) {
			console.log('raven shouldSendCallback(…)', data)
			return true
		},*/
		// maxMessageLength
		// maxUrlLength
		// autoBreadcrumbs
		// maxBreadcrumbs
		// captureUnhandledRejections: false,
		/* transport: function (options) {
			... send data
		},*/
		// allowDuplicates
		// allowSecretKey
		debug: true,
		//instrument:
	})
	.install();

// https://docs.sentry.io/clients/javascript/usage/#tracking-users
// TODO
Raven.setUserContext({
	email: 'matt@example.com',
	id: '123'
})

Raven.captureMessage('Test captureMessage1')
Raven.captureMessage('Test captureMessage2', {
	level: 'info' // one of 'info', 'warning', or 'error'
})
