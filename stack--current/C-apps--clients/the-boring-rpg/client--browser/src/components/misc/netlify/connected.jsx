import { Component } from 'react'
import PropTypes from 'prop-types'

import get_game_instance from '../../../services/game-instance-browser'
import { open_ui as open_netlify_identity_ui, log_out } from '../../../services/user_account'
import { AppStateContext } from '../../../context'

import View from './component'



function on_click_on_signin_button() {
	open_netlify_identity_ui()
}

function on_request_logout() {
	log_out()
}


export default function NetlifyIndicator() {
	return (
		<AppStateContext.Consumer>
			{app_state => {
				const { login_state, logged_in_user } = get_game_instance().view.get()

				return (
					<View
						state={login_state}
						user={logged_in_user}
						on_click_on_signin_button={on_click_on_signin_button}
						on_request_logout={on_request_logout}
					/>
				)
			}}
		</AppStateContext.Consumer>
	)
}
