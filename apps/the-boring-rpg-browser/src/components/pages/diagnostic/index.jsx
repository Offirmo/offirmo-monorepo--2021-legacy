import React, { Component, Fragment } from 'react'

import { get_debug_snapshot } from '@offirmo/features-detection-browser'


export default class Diagnostic extends Component {


	render = () => {
		return (
			<div className="o⋄pad⁚7">
				<button onClick={() => this.setState({})}>Refresh</button>
				<h1>Diagnostic area</h1>
				<pre>
				{JSON.stringify(get_debug_snapshot(), null, 2)}
			</pre>
			</div>
		)
	}
}
