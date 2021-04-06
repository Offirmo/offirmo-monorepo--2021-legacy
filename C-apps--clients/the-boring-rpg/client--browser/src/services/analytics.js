'use strict'

import assert from 'tiny-invariant'

import { getRootSEC } from '@offirmo-private/soft-execution-context'
import { load_script_from_top } from '@offirmo-private/xoff'
import { overrideHook } from '@offirmo/universal-debug-api-browser'
import { asap_but_out_of_immediate_execution, schedule_when_idle_but_not_too_far } from '@offirmo-private/async-utils'

import { VERSION } from '../build.json'


/* simple init code, should not be too intensive
 */
function _initialize_google_analytics_phase_1() {
	getRootSEC().xTry('configuring ga (1/2)…', ({ IS_DEV_MODE, CHANNEL, logger }) => {
		logger.groupCollapsed('🕴setting up ga… (1/2)', { IS_DEV_MODE, CHANNEL })
		assert(ga && ga.l, 'ga global variables ok')

		// REMINDER: those calls are just enqueuing into an array, very cheap
		ga('create', 'UA-103238291-2', 'auto')
		ga(tracker => logger.info('(🕴callback) ga loaded!', { clientId: tracker.get('clientId') }))

		const default_should_send_ga = !IS_DEV_MODE && CHANNEL === 'prod'
		const actual_should_send_ga = overrideHook('should_send_ga', default_should_send_ga) === true
		if (!actual_should_send_ga) {
			ga('set', 'sendHitTask', null)
			if (overrideHook('should_trace_ga', false)) window.ga_debug = { trace: true }
		}

		logger.trace('🕴configuring ga', {
			default_should_send_ga,
			actual_should_send_ga,
			ov_should_send_ga: overrideHook('should_send_ga', undefined),
			ov_should_trace_ga: overrideHook('should_trace_ga', undefined),
		})
		ga(() => logger.log('(🕴callback) ga configured!'))

		ga('set', 'appName', 'The Boring RPG')
		ga('set', 'appId', 'com.OffirmoOnlineAdventures.TheBoringRPG')
		ga('set', 'appVersion', VERSION)
		ga(() => logger.log('🕴ga informed!'))

		ga('send', 'pageview')

		logger.groupEnd()
	})
}

function _initialize_google_analytics_phase_2() {
	getRootSEC().xTry('configuring ga (2/2)…', ({ IS_DEV_MODE, CHANNEL, logger }) => {
		let ga_script_url = 'https://www.google-analytics.com/analytics.js'
		if (IS_DEV_MODE || CHANNEL !== 'prod') {
			// https://developers.google.com/analytics/devguides/collection/analyticsjs/debugging
			ga_script_url = ga_script_url.slice(0, -3) + '_debug.js'
		}

		logger.trace('🕴setting up ga… (2/2)', { ga_script_url })

		load_script_from_top(ga_script_url, window)
			.then((script) => {
				logger.log(`✅ analytics script loaded from top`, { script, window })
			})
			.catch(err => {
				logger.warn('analytics script failed to load:', { err })
				// swallow
			})
	})
}

export default function init() {
	asap_but_out_of_immediate_execution(_initialize_google_analytics_phase_1)

	schedule_when_idle_but_not_too_far(_initialize_google_analytics_phase_2)
}
