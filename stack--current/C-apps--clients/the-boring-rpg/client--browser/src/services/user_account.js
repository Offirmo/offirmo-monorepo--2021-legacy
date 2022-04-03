'use strict'

import assert from 'tiny-invariant'

import { schedule_when_idle_but_not_too_far } from '@offirmo-private/async-utils'
import { getRootSEC } from '@offirmo-private/soft-execution-context'
import { poll } from '@offirmo-private/poll-window-variable'
import Deferred from '@offirmo/deferred'
//import fetch from '@tbrpg/flux/src/utils/fetch'
import { load_script_from_top, execute_from_top, get_log_symbol, get_top_ish_window } from '@offirmo-private/xoff'
import { Endpoint, fetch_oa, get_api_base_url } from '@online-adventur.es/api-client'

import { CHANNEL } from './channel'
import { ACCOUNT_STATE } from './game-instance-browser'
import { set_user_context as set_raven_user_context, report_error } from './raven'
import logger from './logger'
import get_game_instance from './game-instance-browser'

//console.log(__filename)
/////////////////////////////////////////////////

function get_netlify_user_name(user) {
	if (user.user_metadata && user.user_metadata.full_name)
		return user.user_metadata.full_name

	return user.email
}

////////////////////////

const REDIRECT_LS_KEY = 'OA.pending_redirect'
function request_redirect(url) {
	const redirect_request = {
		url,
		timestamp_ms: Date.now(),
	}

	localStorage.setItem(REDIRECT_LS_KEY, JSON.stringify(redirect_request))
}

////////////////////////

const ↆNetlifyIdentity = new Deferred()
ↆNetlifyIdentity.catch(err => {
	console.warn('Netlify failed to load, won’t be able to login.', { err }, err)
})


function _ↆrefresh_login_state() {
	get_game_instance().view.set_state(_ => ({
		login_state: ACCOUNT_STATE.pending,
		logged_in_user: null,
	}))

	let user
	const ↆfully_loaded = ↆNetlifyIdentity.then(function _refresh_login_state(NetlifyIdentity) {
		user = NetlifyIdentity.currentUser()

		if (!user) return

		// refresh token, https://github.com/netlify/netlify-identity-widget/issues/108
		return user.jwt()
			.then(function _wait_for_user_constructed() {
				logger.info('NetlifyIdentity: user refreshed (1/2)', JSON.parse(JSON.stringify(user)))

				// seen that user is not immediately fully populated
				// we need to wait a bit
				return poll(
					() => !!user.user_metadata && !!user.app_metadata && !!user.token && !!user.token.access_token,
					{ timeoutMs: 30 * 1000 }
				)
			})
			.then(function _log() {
				logger.info('NetlifyIdentity: user refreshed (2/2)', JSON.parse(JSON.stringify(user)))
			})
			.catch(err => {
				logger.warn('NetlifyIdentity⚡ error on trying to finalize user', {
					err,
					user,
				})
				report_error(new Error(`NetlifyIdentity⚡ error on trying to finalize user! (${!user.user_metadata},${!!user.app_metadata},${!!user.token},${!!(user.token || {}).access_token},)`))
				/* swallow the error */

				// TODO ??
				// ↆNetlifyIdentity.logout()
			})
	})

	ↆfully_loaded.then(function register_user_for_raven(user) {
		const avatar_name = get_game_instance().queries.get_sub_state('avatar').name

		if (!user) {
			// initial call when not logged in
			set_raven_user_context({
				name: avatar_name,
				id: avatar_name,
			})
			return
		}

		set_raven_user_context({
			email: user.email,
			name: avatar_name,
			id: avatar_name, // TODO change
		})
	})

	ↆfully_loaded.then(function _forward_logged_in_details_to_game_state() {
		if (!user) {
			get_game_instance().commands.on_logged_in_refresh(
				false,
			)
			return
		}

		get_game_instance().commands.on_logged_in_refresh(
			true,
			user.app_metadata.roles,
		)
	})

	ↆfully_loaded.then(function _update_logged_in_view() {
		if (!user) {
			get_game_instance().view.set_state(_ => ({
				login_state: ACCOUNT_STATE.not_logged_in,
				logged_in_user: null,
			}))
			return
		}

		get_game_instance().view.set_state(_ => ({
			login_state: ACCOUNT_STATE.logged_in,
			logged_in_user: user,
		}))
	})

	ↆfully_loaded.then(function _phone_home() {
		// TODO use sth else
		getRootSEC().injectDependencies({
			shared_fetch_headers: {
				...(user && {'Authorization': `Bearer ${user.token.access_token}`}),
			},
		})
		if (!user) return

		return fetch_oa({
			SEC: getRootSEC(),
			url: Endpoint["whoami"],
		})
		/*const enpoint_url = get_api_base_url(CHANNEL) + '/' + Endpoint["whoami"]
		fetch(enpoint_url, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${user.token.access_token}`,
			},
		})*/
	})
}


export default function init(SEC = getRootSEC()) {
	SEC.xTry('initializing user account', ({ logger }) => {

		schedule_when_idle_but_not_too_far(() => {
			load_script_from_top('https://identity.netlify.com/v1/netlify-identity-widget.js')
				.then(function _attach_netlify_to_global_scope() {
					console.log('✅ netlify script loaded from top')

					const ↆattachment_to_global_scope_scheduled = execute_from_top((prefix) => {
						console.log(`${prefix} following netlify loaded…`, window, window.netlifyIdentity, window.oᐧextra)
						if (!window.netlifyIdentity || !window.oᐧextra) {
							console.log('following netlify loaded: incorrect environment! Can’t finish loading!')
							return
						}
						window.oᐧextra.netlifyIdentity = window.oᐧextra.netlifyIdentity || window.netlifyIdentity
					}, get_log_symbol(get_top_ish_window()) + ' ← ' + get_log_symbol())

					// setTimeout() should suffice but give extra margin
					const ↆattachment_to_global_scope_executed_and_succeeded = ↆattachment_to_global_scope_scheduled.then(() => {
						return poll(
							() => !!oᐧextra.netlifyIdentity,
							{ timeoutMs: 2 * 1000 }
						)
					})

					return ↆattachment_to_global_scope_executed_and_succeeded
				})
				.then(
					() => ↆNetlifyIdentity.resolve(window.oᐧextra.netlifyIdentity),
					(err = new Error('load_script_from_top() netlify failed!')) => ↆNetlifyIdentity.reject(err),
				)
		})

		ↆNetlifyIdentity.then(() => {
			logger.verbose('NetlifyIdentity lib loaded and installed ✅')
			_ↆrefresh_login_state() // needed if the user is already logged in
		}, () => {})

		// listen to future events
		ↆNetlifyIdentity.then(function attach_listeners(NetlifyIdentity) {
			NetlifyIdentity.on('init', user => logger.info('NetlifyIdentity⚡ init', user))

			// note: called only on FRESH login
			NetlifyIdentity.on('login', user => {
				logger.info('NetlifyIdentity⚡ new login', user)
				_ↆrefresh_login_state()
			})

			NetlifyIdentity.on('logout', () => {
				logger.info('NetlifyIdentity⚡ Logged out')
				_ↆrefresh_login_state()
			})

			NetlifyIdentity.on('error', (err = new Error('Unknown NetlifyIdentity error!')) => {
				logger.warn('NetlifyIdentity⚡ on(error)', err)
				// TODO state to error?
				// let's see in Sentry reports if this to happen
				report_error(err)
			})

			NetlifyIdentity.on('open', () => {
				logger.info('NetlifyIdentity⚡ Widget opened')
			})

			NetlifyIdentity.on('close', () => {
				logger.info('NetlifyIdentity⚡ Widget closed')
			})
		}, () => {})
	})
}

////////////////////////

function open_ui() {
	ↆNetlifyIdentity.then(() => {
		request_redirect(window.location.href) // needed for social logins
		execute_from_top((prefix) => {
			console.log(`${prefix} netlify open…`)
			window.netlifyIdentity.open()
		}, get_log_symbol(get_top_ish_window()) + ' ← ' + get_log_symbol())
	}, () => {})
	// any event will be handled in the handlers above
}

function log_out() {
	ↆNetlifyIdentity.then(() => {
		execute_from_top((prefix) => {
			console.log(`${prefix} netlify logout…`)
			window.netlifyIdentity.logout()
		}, get_log_symbol(get_top_ish_window()) + ' ← ' + get_log_symbol())
	}, () => {})
	// any event will be handled in the handlers above
}

////////////////////////

export {
	init,
	open_ui,
	log_out,
	get_netlify_user_name,
}
