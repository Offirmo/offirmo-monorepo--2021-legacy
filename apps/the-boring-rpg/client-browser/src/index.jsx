import React from 'react'
import ReactDOM from 'react-dom'
//import 'react-circular-progressbar/dist/styles.css'
import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo-private/universal-debug-api-full-browser'
import { setTextEncoder } from '@tbrpg/flux'

import './services/raven'
import Root from './components/root'
import './index.css'

//console.log(__filename)
/////////////////////////////////////////////////

window.XOFF = {
	flags: {
		is_paused: overrideHook('should-start-paused', false),
		debug_render: overrideHook('should-trace-renders', false),
	}
}

setTextEncoder(TextEncoder)

ReactDOM.render(
	<ErrorBoundary name={'tbrpg_root'}>
		<Root />
	</ErrorBoundary>,
	document.getElementById('root'),
)
