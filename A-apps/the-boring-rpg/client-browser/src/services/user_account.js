import poll_window_variable, { poll } from '@offirmo-private/poll-window-variable'
import Deferred from '@offirmo/deferred'
import { load_script_from_top, execute_from_top, get_log_prefix, get_top_window } from '@offirmo-private/xoff'

import { ACCOUNT_STATE } from './game-instance-browser'
import { set_user_context } from './raven'
import get_game_instance from './game-instance-browser'

//console.log(__filename)
/////////////////////////////////////////////////


function get_name(user) {
	if (user.user_metadata && user.user_metadata.full_name)
		return user.user_metadata.full_name

	return user.email
}

const REDIRECT_LS_KEY = 'OA.pending_redirect'
function request_redirect(url) {
	const redirect_request = {
		url,
		timestamp_ms: Date.now(),
	}

	localStorage.setItem(REDIRECT_LS_KEY, JSON.stringify(redirect_request))
}

const NetlifyIdentity = new Deferred()

setTimeout(() => {
	load_script_from_top('https://identity.netlify.com/v1/netlify-identity-widget.js')
		.then((s) => {
			console.log('✅ netlify script loaded from top')
			execute_from_top((prefix) => {
				console.log(`${prefix} Hello eval!`, window.netlifyIdentity, window.oᐧextra)
				window.oᐧextra.netlifyIdentity = window.oᐧextra.netlifyIdentity || window.netlifyIdentity
			}, get_log_prefix(get_top_window()) + '←' + get_log_prefix())
			setTimeout(() => {
				NetlifyIdentity.resolve(window.oᐧextra.netlifyIdentity)
			}, 10)
		})
		.catch(err => {
			console.error('netlify script failed to load:', err)
			NetlifyIdentity.reject(err)
		})
})

//const NetlifyIdentity = poll_window_variable('netlifyIdentity', { timeoutMs: 5 * 60 * 1000 })

function init(SEC, game_instance) {
	SEC.xTry('initializing user account', ({logger}) => {
		function update_state(props) {
			game_instance.view.set_state(state => ({
				...props,
			}))
		}

		NetlifyIdentity.then(() => {
			logger.verbose('NetlifyIdentity lib loaded ✅')
			refresh_login_state().then(function register_user_for_raven(user) {
				const avatar_name = game_instance.queries.get_sub_state('avatar').name

				if (!user) {
					// initial call when not logged in
					set_user_context({
						name: avatar_name,
						id: avatar_name,
					})
					return
				}

				set_user_context({
					email: user.email,
					name: avatar_name,
					id: avatar_name,
				})
			})
		})

		NetlifyIdentity.then(function attach_listeners(NetlifyIdentity) {
			NetlifyIdentity.on('init', user => logger.info('NetlifyIdentity⚡ init', user))

			// note: called only on FRESH login
			NetlifyIdentity.on('login', user => {
				logger.info('NetlifyIdentity⚡ login', user)
				refresh_login_state()
			})

			NetlifyIdentity.on('logout', () => {
				logger.info('NetlifyIdentity⚡ Logged out')
				refresh_login_state()
			})

			NetlifyIdentity.on('error', err => {
				logger.error('NetlifyIdentity⚡ error', err)
				// TODO state to error?
				throw err // rethrow, to be caught by Sentry
				// let's see if Sentry reports this to happen
			})

			NetlifyIdentity.on('open', () => {
				logger.info('NetlifyIdentity⚡ Widget opened')
			})

			NetlifyIdentity.on('close', () => {
				logger.info('NetlifyIdentity⚡ Widget closed')
			})
		})

		function refresh_login_state() {
			update_state({
				login_state: ACCOUNT_STATE.pending,
				logged_in_user: null,
			})

			return NetlifyIdentity.then(function refresh_login_state(NetlifyIdentity) {
				const user = NetlifyIdentity.currentUser()

				if (!user) {
					update_state({
						login_state: ACCOUNT_STATE.not_logged_in,
						logged_in_user: null,
					})
					return
				}

				// refresh token, https://github.com/netlify/netlify-identity-widget/issues/108
				return user.jwt()
					.then(() => {
						logger.info('NetlifyIdentity: user refreshed', user)

						get_game_instance().commands.on_logged_in_refresh(
							true,
							user.app_metadata.roles,
						)

						// user may not be fully populated immediately
						// we need to wait a bit
						return poll(() => !!user.user_metadata, { timeoutMs: 30 * 1000 })
					})
					.catch(err => {
						logger.error('NetlifyIdentity⚡ on trying to finalize user', err)
						/* swallow the error */
						// TODO ??
						/*
                      // clean up
                      NetlifyIdentity.logout()
                      */
					})
					.then(() => {
						update_state({
							login_state: ACCOUNT_STATE.logged_in,
							logged_in_user: user,
						})
						return user
					})
			})
		}
	})
}

export {
	get_name,
	request_redirect,
	NetlifyIdentity,
	init,
}
