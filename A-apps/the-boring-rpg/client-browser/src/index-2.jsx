import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo/universal-debug-api-browser'

import { setTextEncoder } from '@tbrpg/flux'

import { loader } from '@offirmo-private/iframe-loading/src/iframe-loading'
import './services/raven'
import Root from './components/root'
//import 'react-circular-progressbar/dist/styles.css'
import './index-2.css'

console.log('hello from index-2', { __filename, loader })

/////////////////////////////////////////////////

window.XOFF.flags = {
	is_paused: overrideHook('should_start_paused', false),
	debug_render: overrideHook('should_trace_renders', false),
	...window.XOFF.flags,
}

setTextEncoder(TextEncoder)

loader.configure({
	legend: 'The Boring RPG, reloaded'
})
setTimeout(() => ReactDOM.render(
	<ErrorBoundary name={'tbrpg_root'}>
		<Root />
	</ErrorBoundary>,
	document.getElementById('root'),
),
)
