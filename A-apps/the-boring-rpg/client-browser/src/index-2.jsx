import React from 'react'
import ReactDOM from 'react-dom'

import { set_xoff_flag, load_script_from_top, get_log_prefix, execute_from_top, get_top_window } from '@offirmo-private/xoff'
import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo/universal-debug-api-browser'
import get_loader from '@offirmo-private/iframe-loading'

import { setTextEncoder } from '@tbrpg/flux'

import './services/raven'
import Root from './components/root'
//import 'react-circular-progressbar/dist/styles.css'
import './index-2.css'
import {get_xoff} from '@offirmo-private/xoff/src'

//console.log('hello from index-2', { __filename })

/////////////////////////////////////////////////

set_xoff_flag('debug_render', overrideHook('should_trace_renders', false))
set_xoff_flag('is_paused', overrideHook('should_start_paused', false))

get_loader().configure({
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
))

setTimeout(() => {
	load_script_from_top('https://www.googletagmanager.com/gtag/js?id=UA-103238291-2')
		.then((script) => {
			console.log(`${get_log_prefix()} ✅ ↆanalytics_script loaded from top`, script, window)
			execute_from_top((prefix) => {
				console.log(`${prefix} following google loaded…`, window.dataLayer, window.oᐧextra)
				window.dataLayer = window.dataLayer || []
				function gtag() { dataLayer.push(arguments) }
				gtag('js', new Date())
				gtag('config', 'UA-103238291-2')
				window.oᐧextra.gtag = gtag
			}, get_log_prefix(get_top_window()) + '←' + get_log_prefix())
		})
		.catch(err => console.error('analytics script failed to load:', err))
})
