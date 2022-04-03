import React from 'react'
import ReactDOM from 'react-dom'

import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo/universal-debug-api-browser'
import { asap_but_out_of_immediate_execution, schedule_when_idle_but_within_human_perception } from '@offirmo-private/async-utils'

import init_SEC from '../services/sec'
import Root from './root'

import './index-2.css'
import '@oh-my-rpg/assets--cursors/src/style.css'

/////////////////////////////////////////////////

asap_but_out_of_immediate_execution(() => {
	console.groupCollapsed('——————— end of immediate, synchronous, non-import code ———————')
	console.groupEnd()
})

/////////////////////////////////////////////////

init_SEC()

schedule_when_idle_but_within_human_perception(() => {
	console.log('🔄 starting react…')
	ReactDOM.render(
		<ErrorBoundary name={'rpg_root'}>
			<Root />
		</ErrorBoundary>,
		document.getElementById('root'),
	)
})
