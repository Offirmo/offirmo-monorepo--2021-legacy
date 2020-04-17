import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo/universal-debug-api-browser'

import { setTextEncoder } from '@tbrpg/flux'

import './services/raven'
import Root from './components/root'
//import 'react-circular-progressbar/dist/styles.css'
import './index-2.css'

//console.log(__filename)
/////////////////////////////////////////////////

window.XOFF = {
	flags: {
		is_paused: overrideHook('should_start_paused', false),
		debug_render: overrideHook('should_trace_renders', false),
	},
}

setTextEncoder(TextEncoder)

setTimeout(() => ReactDOM.render(
	<ErrorBoundary name={'tbrpg_root'}>
		<Root />
	</ErrorBoundary>,
	document.getElementById('root'),
),
)
