import React, { Component } from 'react'
import PropTypes from 'prop-types'


import get_game_instance, { request_redirect } from '../../../services/game-instance-browser'
import { AppStateContext } from '../../../context'

import View from './component'


function on_click_on_signin_button() {
	request_redirect(window.location.href)
	this.NetlifyIdentity.open()
}

function on_request_logout() {
	this.NetlifyIdentity.logout()
}


export default function NetlifyIndicator() {
	//console.log('🔄 NetlifyIndicator')

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
