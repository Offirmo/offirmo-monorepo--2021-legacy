import {
	LogDetails,
} from '@offirmo/practical-logger-types'


export function looksLikeAnError(x: any): boolean {
	return !!(x.name && x.message && x.stack)
}

// harmonize
// also try to recover from some common errors
// TODO assess whether it's really good to be that permissive (also: hurts perfs)
export function normalizeArguments(args: IArguments): [ string, LogDetails ] {
	//console.log('>>> NA', Array.from(args))

	let message: string = ''
	let details: Readonly<LogDetails> = {}
	let err: Error | undefined = undefined

	if (args.length > 2) {
		//console.warn('NA 1', args)
		// wrong invocation,
		// most likely a "console.log" style invocation from an untyped codebase.
		// "best effort" fallback:
		message = Array.prototype.join.call(args, ' ')
		details = {}
	}
	else {
		//console.log('NA 2')
		message = args[0] || ''
		details = args[1] || {}

		// optimization
		if (!message || typeof args[0] !== 'string' || typeof details !== 'object') {
			// non-nominal call
			//console.warn('NA 2.1')

			// try to fix message (attempt 1)
			if (typeof message !== 'string') {
				//console.warn('NA 2.1.1', { message, details })
				if (looksLikeAnError(message)) {
					//console.warn('NA 2.1.1.1')
					// Another bad invocation
					// "best effort" fallback:
					err = message as Error
					message = err.message
				}
				else if (typeof message === 'object' && !args[1]) {
					// no message, direct details
					//console.warn('NA 2.1.1.2')
					details = message as LogDetails
					message = ''
				}
				else {
					//console.warn('NA 2.1.1.3')
					message = String(message)
				}
			}

			// try to fix details
			if (typeof details !== 'object') {
				//console.warn('NA 2.1.2', { details })
				// Another bad invocation
				// "best effort" fallback:
				message = [ message, String(details) ].join(' ')
				details = {}
			}

			// ensure we picked up err
			err = err || details.err

			// attempt to fix message (attempt 2, after uniformizing details)
			if (!message && details.message) {
				//console.warn('NA 2.1.3', { details })
				const { message: m2, ...d2 } = details
				message = m2
				details = d2
			}

			message = message || (err && err.message) || '(no message)'
		}

		if (!err && looksLikeAnError(details)) {
			//console.warn('NA 2.2', { details })
			// details is in fact an error, extract it
			err = details as Error
			details = { err }
		}
		else if (err)
			details = { err, ...details }
		else
			details = { ...details }
	}

	return [ message, details ]
}

