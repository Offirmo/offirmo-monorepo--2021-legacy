import assert from 'tiny-invariant'
import * as React from 'react'
import ReactDOM from 'react-dom'

import { set_xoff_flag, load_script_from_top } from '@offirmo-private/xoff'
import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo/universal-debug-api-browser'
import get_loader from '@offirmo-private/iframe-loading'

import { setTextEncoder } from '@tbrpg/flux'

import { CHANNEL } from './services/channel'
import './services/raven'
import Root from './components/root'
//import 'react-circular-progressbar/dist/styles.css'
import './index-2.css'
import {get_xoff} from '@offirmo-private/xoff/src'

//console.log('hello from index-2', { __filename })

/////////////////////////////////////////////////
setTimeout(() => console.log('——————— end of immediate synchronous code ———————'))

set_xoff_flag('debug_render', overrideHook('should_trace_renders', false))
set_xoff_flag('is_paused', overrideHook('should_start_paused', false))

get_loader().configure({
	bg_color: 'rgb(84, 61, 70)',
	fg_color: 'rgb(255, 235, 188)',
	legend: 'The Boring RPG, reborn'
})

setTextEncoder(TextEncoder)

setTimeout(() => ReactDOM.render(
	<ErrorBoundary name={'tbrpg_root'}>
		<Root />
	</ErrorBoundary>,
	document.getElementById('root'),
), 5)

setTimeout(() => {
	assert(ga && !ga.l)

	console.log('ga', {CHANNEL})
	if (CHANNEL !== 'prod') {
		ga = function (...args) {
			console.log('(disabled) ga(', ...args, ')')
		}
	}

	ga.l = +new Date
	ga('create', 'UA-103238291-2', 'auto')
	ga('send', 'pageview')
	ga(function(tracker) {
		console.log('ga loaded!', { clientId: tracker.get('clientId') })
	})

//	load_script_from_top('https://www.googletagmanager.com/gtag/js?id=UA-103238291-2')
	load_script_from_top('https://www.google-analytics.com/analytics.js')
		.then((script) => {
			console.log(`✅ analytics script loaded from top`, script, window)
		})
		.catch(err => {
			err = err || new Error('load_script_from_top() analytics failed!')
			console.error('analytics script failed to load:', err)
			// swallow
		})
}, 100)
