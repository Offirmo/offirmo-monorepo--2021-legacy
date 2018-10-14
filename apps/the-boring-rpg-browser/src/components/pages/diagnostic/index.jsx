import React, { Component, Fragment } from 'react'

import { get_debug_snapshot } from '@offirmo/features-detection-browser'

const { getRootSEC } = require('@offirmo/soft-execution-context')


function get_data() {
	const SEC = getRootSEC()
	const test_err = new Error('Diagnostic!')
	SEC._decorateErrorWithDetails(test_err)

	console.log({test_err})

	return {
		'err.details': test_err.details,
		'features-detection': get_debug_snapshot(),
	}
}


export default class Diagnostic extends Component {
	render = () => {
		return (
			<div className="o⋄pad⁚7">
				<button onClick={() => this.setState({})}>Refresh</button>
				<h1>Diagnostic area</h1>
				<pre>
				{JSON.stringify(get_data(), null, 3)}
			</pre>
			</div>
		)
	}
}
