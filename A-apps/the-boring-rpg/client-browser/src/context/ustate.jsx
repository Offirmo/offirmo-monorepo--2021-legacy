import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render_any_m } from '@offirmo-private/react-error-boundary'

import get_game_instance from '../services/game-instance-browser'
import { AppStateContext } from './app-state'


function UStateListenerAndProvider({ children, render }) {
	return (
		<AppStateContext.Consumer>
			{local_app_state => {
				const local_revision = local_app_state ? local_app_state.model.u_state.revision : -1

				const latest_ustate = get_game_instance().model.get().u_state
				const latest_revision = latest_ustate.revision

				//console.log(`🔄 UStateListenerAndProvider #${latest_revision}`/*, { app_state, children, render }*/)

				/*if (latest_revision !== local_revision)
					console.warn(`UState Context discrepancy: local = ${local_revision}, latest = ${latest_revision}`)
				*/

				return render_any_m({
					children,
					render,
					u_state: latest_ustate,
				})
			}}
		</AppStateContext.Consumer>
	)
}

export default UStateListenerAndProvider
