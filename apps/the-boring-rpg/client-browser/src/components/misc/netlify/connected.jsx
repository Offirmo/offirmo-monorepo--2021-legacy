import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { set_user_context } from '../../../services/raven'

import View from './component'
import get_game_instance from '../../../services/game-instance-browser'

const REDIRECT_LS_KEY = 'OA.pending_redirect'
function request_redirect(url) {
	const redirect_request = {
		url,
		timestamp_ms: Date.now(),
	}

	localStorage.setItem(REDIRECT_LS_KEY, JSON.stringify(redirect_request))
}

function on_logged_in(user) {
	const avatar_name = get_game_instance().queries.get_sub_state('avatar').name

	set_user_context({
		email: user.email,
		name: avatar_name,
		id: avatar_name,
	})

	get_game_instance().commands.on_logged_in_update(
		true,
		user.app_metadata.roles || [],
	)
}

export default class NetlifyIdentity extends Component {
	static propTypes = {
	}

	constructor(props) {
		super(props)

		const avatar_name = get_game_instance().queries.get_sub_state('avatar').name

		// initial call when not logged in
		set_user_context({
			name: avatar_name,
			id: avatar_name,
		})
	}

	render() {
		return (
			<View
				on_logged_in={on_logged_in}
				request_redirect={request_redirect}
			/>
		)
	}
}
