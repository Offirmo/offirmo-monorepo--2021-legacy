import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { get_debug_snapshot } from '@offirmo-private/features-detection-browser'

import { getRootSEC } from '@offirmo-private/soft-execution-context'


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


export default class PageDiagnostic extends Component {
	static propTypes = {
	}

	render = () => {
		console.log('🔄 PageDiagnostic')
		return (
			<div className="o⋄paddingꘌmedium">
				<button onClick={() => this.setState({})}>Refresh</button>
				<h1>Diagnostic area</h1>
				<pre>
					{JSON.stringify(get_data(), null, 3)}
				</pre>
			</div>
		)
	}
}
