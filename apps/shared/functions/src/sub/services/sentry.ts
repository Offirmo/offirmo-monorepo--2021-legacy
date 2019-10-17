import { XError } from "@offirmo-private/common-error-fields";

// https://docs.sentry.io/error-reporting/quickstart/?platform=node
const Sentry = require('@sentry/node')
//Sentry.captureException(err)
//Sentry.captureMessage(err.message)

import { CHANNEL } from './channel'

console.log(Object.keys(Sentry.Integrations))

Sentry.init({
	dsn: 'https://a86696dcd573448a8fcc3bd7151349b4@sentry.io/1772719',
	debug: process.env.NODE_ENV === 'development',
	//release TODO
	environment: CHANNEL,
	attachStacktrace: true, // why not?
	//shutdownTimeout TODO needed ?
	integrations: (integrations: any) => {
		// please Sentry! I don't want your crappy integrations!
		// https://docs.sentry.io/platforms/node/#removing-an-integration
		return []
	}
})

Sentry.configureScope((scope: any) => {
	scope.setExtra('channel', CHANNEL)
	// TODO node version etc. ?
});

export function on_error(err: XError) {
	// TODO inspect the SEC?
	Sentry.captureException(err)
}

// https://docs.sentry.io/enriching-error-data/context/?platform=node#capturing-the-user
export function on_user_recognized(user: { id: string, username:string, email: string, ip_address: string }): void {
	Sentry.configureScope((scope: any) => {
		scope.setUser(user)
	})
}

// TODO self-triage?
// https://docs.sentry.io/enriching-error-data/context/?platform=node#setting-the-level
