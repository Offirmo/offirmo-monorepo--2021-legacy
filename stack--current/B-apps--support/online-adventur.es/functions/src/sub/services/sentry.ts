// https://docs.sentry.io/error-reporting/quickstart/?platform=node
// https://httptoolkit.tech/blog/netlify-function-error-reporting-with-sentry/
const Sentry = require('@sentry/node')
//Sentry.captureException(err)
//Sentry.captureMessage(err.message)

import { XXError } from '@offirmo/error-utils'

import { CHANNEL } from './channel'

/////////////////////////////////////////////////

Sentry.init({
	// https://getsentry.github.io/sentry-javascript/interfaces/node.nodeoptions.html
	dsn: 'https://a86696dcd573448a8fcc3bd7151349b4@sentry.io/1772719',
	debug: process.env.NODE_ENV === 'development',
	//release TODO
	environment: CHANNEL,
	attachStacktrace: true, // why not?
	//shutdownTimeout TODO needed ?
	integrations: (default_integrations: any) => {
		// please Sentry! I don't want your crappy integrations!
		//console.log(default_integrations)
		// https://docs.sentry.io/platforms/node/#removing-an-integration
		return []
	}
})

Sentry.configureScope((scope: any) => {
	scope.setExtra('channel', CHANNEL)
	scope.setExtra('node', process.versions.node)
	// TODO node version etc. ?
})

export async function on_error(err: XXError): Promise<void> {
	console.log('💣 Reporting to Sentry...', err.message)

	// TODO inspect the SEC?

	Sentry.captureException(err)
	await Sentry.flush()
}

// https://docs.sentry.io/enriching-error-data/context/?platform=node#capturing-the-user
// TODO shared across invocations??
export function on_user_recognized(user: { id: string, username:string, email: string, ip_address: string }): void {
	Sentry.configureScope((scope: any) => {
		scope.setUser(user)
	})
}

// TODO self-triage?
// https://docs.sentry.io/enriching-error-data/context/?platform=node#setting-the-level

// TODO breadcrumb
