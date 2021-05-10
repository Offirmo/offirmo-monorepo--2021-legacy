import { Component } from 'react'
import PropTypes from 'prop-types'
import { render_any_m } from '@offirmo-private/react-error-boundary'

import get_game_instance from '../services/game-instance-browser'
import { AppStateContext } from './app-state'


function UStateListenerAndProvider({ children, render }) {
	return (
		<AppStateContext.Consumer>
			{local_app_state => {
				const { u_state } = get_game_instance().model.get()

				return render_any_m({
					children,
					render,
					u_state,
				})
			}}
		</AppStateContext.Consumer>
	)
}

export default UStateListenerAndProvider
