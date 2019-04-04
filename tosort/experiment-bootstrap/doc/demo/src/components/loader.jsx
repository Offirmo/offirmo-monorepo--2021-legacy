import React from 'react'
import Loadable from 'react-loadable'

export default function Loader({ error, pastDelay, timedOut, retry }) {
	if (error) {
		// Forward the error, or else would silently swallow.
		// The error will be caught by the next error boundary.
		throw error
	}

	if (timedOut)
		return <div>Taking a long time... <button onClick={retry}>Retry</button></div>

	if (pastDelay)
		return <div>Loading...</div>

	return null
}
