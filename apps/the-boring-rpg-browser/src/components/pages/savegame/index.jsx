import React, { Component, Fragment } from 'react'
import { LS_KEYS } from '../../../services/consts'



export default class Savegame extends Component {
	render = () => {
		return (
			<div className="o⋄pad⁚7">
				<button onClick={() => this.setState({})}>Refresh</button>
				<h1>Savegame</h1>
				<pre>
				{JSON.stringify(JSON.parse(localStorage.getItem(LS_KEYS.savegame)), null, 2)}
			</pre>
			</div>
		)
	}
}
