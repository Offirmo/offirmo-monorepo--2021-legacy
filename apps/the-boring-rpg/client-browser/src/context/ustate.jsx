import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render_any_m } from '@offirmo/react-error-boundary'

import { AppStateContext } from './app-state'



function UStateListenerAndProvider({ children, render }) {
	return (
		<AppStateContext.Consumer>
			{app_state => {
				console.log('🔄 UStateListenerAndProvider'/*, { app_state, children, render }*/)
				if (!app_state) return null

				return render_any_m({
					u_state: app_state.model.u_state,
					render,
					children,
				})
			}}
		</AppStateContext.Consumer>
	)
}

export default UStateListenerAndProvider
