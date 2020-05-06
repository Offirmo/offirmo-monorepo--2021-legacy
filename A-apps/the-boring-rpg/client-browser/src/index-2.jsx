import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo/universal-debug-api-browser'

import { setTextEncoder } from '@tbrpg/flux'

import '@offirmo-private/iframe-loading/src/iframe-loading'
import './services/raven'
import Root from './components/root'
//import 'react-circular-progressbar/dist/styles.css'
import './index-2.css'

//console.log('hello from index-2', { __filename })

/////////////////////////////////////////////////

window.XOFF.flags = {
	is_paused: overrideHook('should_start_paused', false),
	debug_render: overrideHook('should_trace_renders', false),
	...window.XOFF.flags,
}
window.XOFF.loader.configure({
	bg_color: 'rgb(84, 61, 70)',
	fg_color: 'rgb(255, 235, 188)',
	legend: 'The Boring RPG, reloaded'
})

setTextEncoder(TextEncoder)

setTimeout(() => ReactDOM.render(
	<ErrorBoundary name={'tbrpg_root'}>
		<Root />
	</ErrorBoundary>,
	document.getElementById('root'),
),
)
