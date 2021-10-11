import ReactDOM from 'react-dom'

import { set_xoff_flag } from '@offirmo-private/xoff'
import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo/universal-debug-api-browser'
import get_loader from '@offirmo-private/iframe--loading'
import { asap_but_out_of_immediate_execution, schedule_when_idle_but_within_human_perception } from '@offirmo-private/async-utils'

import { setTextEncoder } from '@tbrpg/flux'

import { CHANNEL } from './services/channel'
import { BUILD_DATE } from './build.json'
import init_analytics from './services/analytics'
import init_analytics_ga4 from './services/analytics-ga4'
import init_cordova from './services/cordova'
import init_SEC from './services/sec'
import init_netlify from './services/user_account'
import Root from './components/root'

import './index-2.css'
import '@oh-my-rpg/assets--cursors/src/style.css'

/////////////////////////////////////////////////

asap_but_out_of_immediate_execution(() => {
	console.groupCollapsed('——————— end of immediate, synchronous, non-import code ———————')
	console.log({ BUILD_DATE, CHANNEL })
	console.groupEnd()
})

/////////////////////////////////////////////////

init_SEC()

get_loader().configure({
	bg_color: 'rgb(84, 61, 70)',
	fg_color: 'rgb(255, 235, 188)',
	legend: 'The Boring RPG, reborn',
	bg_picture: [
		window.getComputedStyle(document.querySelector('html')).backgroundImage,
		'38%', '99%',
	],
})

setTextEncoder(TextEncoder)
init_cordova()
init_analytics()
init_analytics_ga4()
init_netlify()

set_xoff_flag('debug_render', overrideHook('should_trace_renders', false))
set_xoff_flag('is_paused', overrideHook('should_start_paused', false))
if (overrideHook('should_start_paused', false)) {
	console.warn('🛠 GAME STARTING IN PAUSE MODE')
}

schedule_when_idle_but_within_human_perception(() => {
	console.log('🔄 starting react…')
	ReactDOM.render(
		<ErrorBoundary name={'tbrpg_root'}>
			<Root />
		</ErrorBoundary>,
		document.getElementById('root'),
	)
})
