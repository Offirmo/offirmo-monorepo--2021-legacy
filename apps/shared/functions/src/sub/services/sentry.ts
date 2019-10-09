import { XError } from "@offirmo-private/common-error-fields";

// https://docs.sentry.io/error-reporting/quickstart/?platform=node
const Sentry = require('@sentry/node')


Sentry.init({
	dsn: 'https://a86696dcd573448a8fcc3bd7151349b4@sentry.io/1772719',
})


export function on_error(err: XError) {
	Sentry.captureMessage(err.message)
}
