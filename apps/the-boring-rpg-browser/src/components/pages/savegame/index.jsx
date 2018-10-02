import React, { Component, Fragment } from 'react'
import { LS_KEYS } from '../../../services/consts'

import './index.css'

export default class Savegame extends Component {
	render = () => {
		return (
			<div className="o⋄pad⁚7 page--savegame">
				<h1>Savegame</h1><button onClick={() => this.setState({})}>Refresh</button>
				<pre>
				{JSON.stringify(JSON.parse(localStorage.getItem(LS_KEYS.savegame)), null, 2)}
			</pre>
			</div>
		)
	}
}
