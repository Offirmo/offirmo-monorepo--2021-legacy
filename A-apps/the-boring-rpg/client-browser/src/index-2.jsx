import { asap_but_out_of_immediate_execution } from '@offirmo-private/async-utils'

asap_but_out_of_immediate_execution(() => {
	console.groupCollapsed('——————— end of immediate, synchronous, non-import code ———————')
	console.log({ BUILD_DATE, CHANNEL })
	console.groupEnd()
})

import assert from 'tiny-invariant'
import * as React from 'react'
import ReactDOM from 'react-dom'

import { set_xoff_flag } from '@offirmo-private/xoff'
import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo/universal-debug-api-browser'
import get_loader from '@offirmo-private/iframe-loading'

import { setTextEncoder } from '@tbrpg/flux'

import './services/sec'
import './services/raven'
import './services/analytics'
import { BUILD_DATE } from './build.json'
import { CHANNEL } from './services/channel'
import Root from './components/root'

import './index-2.css'

/////////////////////////////////////////////////



set_xoff_flag('debug_render', overrideHook('should_trace_renders', false))
set_xoff_flag('is_paused', overrideHook('should_start_paused', false))
if (overrideHook('should_start_paused', false)) {
	console.warn('🛠 GAME STARTING IN PAUSE MODE')
}

get_loader().configure({
	bg_color: 'rgb(84, 61, 70)',
	fg_color: 'rgb(255, 235, 188)',
	legend: 'The Boring RPG, reborn'
})

setTextEncoder(TextEncoder)

asap_but_out_of_immediate_execution(() => ReactDOM.render(
	<ErrorBoundary name={'tbrpg_root'}>
		<Root />
	</ErrorBoundary>,
	document.getElementById('root'),
))
