'use strict'

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import ReactRouterExample from './react-router-example'

import './index.css'
import logo from './tbrpg_logo_512x98.png'

/*
const workspace = {
	version: WI_VERSION,
	verbose: true, // XXX
	state: null,
	SEC,
}
*/

ReactDOM.render(
	<div>
		Hello world <img src={logo} height="25px" />
		<ul>
			<li>version: {WI_VERSION}</li>
			<li>process.env.NODE_ENV: {process.env.NODE_ENV}</li>
			<li>ENV: {WI_ENV}</li>
			<li>build date: {WI_BUILD_DATE}</li>
		</ul>
		<ReactRouterExample />
	</div>,
	document.getElementById('root'),
)
