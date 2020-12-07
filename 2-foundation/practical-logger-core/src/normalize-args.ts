import {
	LogDetails,
} from '@offirmo/practical-logger-types'


// TODO externalize?
export function looksLikeAnError(x: any): boolean {
	return !!(x?.name && x?.message && x?.stack)
}

// harmonize
// also try to recover from incorrect invocations
export function normalizeArguments(raw_args: IArguments | any[]): [ string, LogDetails ] {
	const message_parts: string[] = []
	let details: LogDetails = {}
	let err: Error | undefined = undefined

	Array.from(raw_args)
		.forEach(arg => {
			if (!arg)
				return

			// errors are first class, look for them first
			if (looksLikeAnError(arg)) {
				if (!err)
					err = arg // extract it
				return
			}
			if (!err && looksLikeAnError(arg.err)) {
				err = arg.err // extract it
				// don't return, still stuff to pick
			}

			if (typeof arg === 'object') {
				details = {
					...details,
					...arg,
				}

				return
			}

			message_parts.push(String(arg))
		})

	if (typeof details.message === 'string' && !message_parts.length) {
		message_parts.push(details.message)
		delete details.message
	}

	const message = message_parts.join(' ') || (err as any)?.message || '(no message)'
	if (err)
		details.err = err
	else
		delete details.err // because could be present but not be a correct err type

	return [ message, details ]
}

