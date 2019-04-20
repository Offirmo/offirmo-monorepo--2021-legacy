import React from 'react'

import 'babel-polyfill'
import ReactDOM from 'react-dom'
//import 'react-circular-progressbar/dist/styles.css'
import ErrorBoundary from '@offirmo-private/react-error-boundary'

import './services/raven'
import './index.css'
import Root from './components/root'

window.XOFF = {
	flags: {
		is_paused: false,
		debug_render: false,
	}
}

ReactDOM.render(
	<ErrorBoundary name={'tbrpg_root'}>
		<Root />
	</ErrorBoundary>,
	document.getElementById('root'),
)
