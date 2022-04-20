import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { ACCOUNT_STATE } from '../../../services/game-instance-browser'
import { get_netlify_user_name } from '../../../services/user_account'

import './index.css'


export default class NetlifyLoggedIndicator extends Component {
	static propTypes = {
		state: PropTypes.string.isRequired,
		user: PropTypes.object,
		on_click_on_signin_button: PropTypes.func.isRequired,
		on_request_logout: PropTypes.func.isRequired,
	}

	render() {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 NetlifyIdentity')

		const { state, user, on_click_on_signin_button, on_request_logout } = this.props

		let content = null
		switch (state) {
			case ACCOUNT_STATE.waiting_for_lib:
				/* fallthrough */
			case ACCOUNT_STATE.pending:
				content = <span className="blinking">...</span>
				break
			case ACCOUNT_STATE.not_logged_in:
				content = <button onClick={on_click_on_signin_button}>Sign in / sign up...</button>
				break
			case ACCOUNT_STATE.logged_in:
				content = (
					<Fragment>
						Logged in as: {get_netlify_user_name(user) || '(pending…)'}
						<button onClick={on_request_logout}>log out</button>
					</Fragment>
				)
				break
			case ACCOUNT_STATE.error:
				/* fallthrough */
			default:
				content = <div>(login error. Disable ad blocker?)</div>
				break
		}

		return (
			<div className="netlify-widget">
				{content}
			</div>
		)
	}
}
