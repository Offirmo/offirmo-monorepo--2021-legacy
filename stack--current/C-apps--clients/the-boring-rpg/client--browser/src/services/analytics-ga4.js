'use strict'

import assert from 'tiny-invariant'

import { getRootSEC } from '@offirmo-private/soft-execution-context'
import { load_script_from_top } from '@offirmo-private/xoff'
import { overrideHook } from '@offirmo/universal-debug-api-browser'
import { asap_but_out_of_immediate_execution, schedule_when_idle_but_not_too_far } from '@offirmo-private/async-utils'

import { VERSION } from '../build.json'


const MEASUREMENT_ID = 'G-VG46HT6WBJ'

/* simple init code, should not be too intensive
 */
function _initialize_google_analytics_phase_1() {
	getRootSEC().xTry('configuring ga4 (1/2)…', ({ IS_DEV_MODE, CHANNEL, logger }) => {
		logger.groupCollapsed('🕴setting up ga4… (1/2)', { IS_DEV_MODE, CHANNEL })

		assert(gtag, 'gtag global variables ok')

		logger.trace('🕴configuring ga4', {})

		gtag('js', new Date())

		gtag('set', {
			// https://developers.google.com/analytics/devguides/collection/gtagjs/screens
			app_name: 'The Boring RPG',
			app_id: 'com.OffirmoOnlineAdventures.TheBoringRPG',
			app_version: VERSION,
			// TODO screen_name 	string 	Yes 	The name of the screen.
		})

		gtag('config', MEASUREMENT_ID)

		logger.groupEnd()
	})
}

function _initialize_google_analytics_phase_2() {
	getRootSEC().xTry('configuring ga4 (2/2)…', ({ IS_DEV_MODE, CHANNEL, logger }) => {
		let ga_script_url = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`

		logger.trace('🕴setting up ga4… (2/2)', { ga_script_url })

		load_script_from_top(ga_script_url, window)
			.then((script) => {
				logger.log(`✅ ga4 analytics script loaded from top`, { script, window })
			})
			.catch(err => {
				logger.warn('ga4 analytics script failed to load:', { err })
				// swallow
			})
	})
}

export default function init() {
	asap_but_out_of_immediate_execution(_initialize_google_analytics_phase_1)

	schedule_when_idle_but_not_too_far(_initialize_google_analytics_phase_2)
}
