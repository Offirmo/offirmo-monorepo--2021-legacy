import assert from 'tiny-invariant'
import * as React from 'react'
import ReactDOM from 'react-dom'

import { set_xoff_flag, load_script_from_top } from '@offirmo-private/xoff'
import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo/universal-debug-api-browser'
import get_loader from '@offirmo-private/iframe-loading'

import { setTextEncoder } from '@tbrpg/flux'

import { BUILD_DATE, VERSION } from './build.json'
import { CHANNEL } from './services/channel'
import './services/raven'
import Root from './components/root'
import './index-2.css'

/////////////////////////////////////////////////

setTimeout(() => {
	console.groupCollapsed('——————— end of immediate synchronous code ———————')
	console.log({ BUILD_DATE, CHANNEL })
	console.groupEnd()
})

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
	let ga_script_url = 'https://www.google-analytics.com/analytics.js'
	if (CHANNEL !== 'prod') {
		https://developers.google.com/analytics/devguides/collection/analyticsjs/debugging
		ga_script_url = ga_script_url.slice(0, -3) + '_debug.js'
	}

	console.log('setting up ga…', { CHANNEL, ga_script_url })
	assert(ga && ga.l)

	if (CHANNEL !== 'prod') {
		ga('set', 'sendHitTask', null)
		if (overrideHook('should_trace_ga', false)) window.ga_debug = { trace: true }
	}
	ga('create', 'UA-103238291-2', 'auto')
	ga('send', 'pageview')
	ga(tracker => console.info('ga loaded!', { clientId: tracker.get('clientId') }))
	ga('set', 'appName', 'The Boring RPG')
	ga('set', 'appId', 'com.OffirmoOnlineAdventures.TheBoringRPG')
	ga('set', 'appVersion', VERSION)

	load_script_from_top(ga_script_url, window)
		.then((script) => {
			console.log(`✅ analytics script loaded from top`, script, window)
		})
		.catch(err => {
			console.error('analytics script failed to load:', { err })
			// swallow
		})
}, 100)
