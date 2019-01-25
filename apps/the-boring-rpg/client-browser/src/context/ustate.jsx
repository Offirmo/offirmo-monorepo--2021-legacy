import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {AppStateContext} from "./app-state"


const UStateListenerAndProviderM = React.memo(
	function UStateListenerAndProvider({ u_state, children, render }) {
		const ComponentOrFunctionOrAny = children | render | '[UStateProviderM error]'

		if (ComponentOrFunctionOrAny.propTypes || ComponentOrFunctionOrAny.render || (ComponentOrFunctionOrAny.prototype && ComponentOrFunctionOrAny.prototype.render))
			return <ComponentOrFunctionOrAny u_state={u_state} />

		if (typeof ComponentOrFunctionOrAny === 'function')
			return ComponentOrFunctionOrAny({ u_state })

		return ComponentOrFunctionOrAny
	}
)

function UStateListenerAndProviderC1({ children, render }) {
	return (
		<AppStateContext.Consumer>
			{app_state => {
				if (!app_state) return null

				return (
					<UStateListenerAndProviderM u_state={app_state.u_state} render={render}>
						{children}
					</UStateListenerAndProviderM>
				)
			}}
		</AppStateContext.Consumer>
	)
}

export default UStateListenerAndProviderC1
