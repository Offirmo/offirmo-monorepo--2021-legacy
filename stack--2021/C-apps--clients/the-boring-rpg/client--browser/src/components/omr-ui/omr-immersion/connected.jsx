import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { OhMyRPGUIContext } from '@tbrpg/ui--browser--react'

import { AppStateContext } from '../../../context'
import get_game_instance from '../../../services/game-instance-browser'
import OMRUINotifier from '../notifier'
import View from './component'


function render_c2(app_state) {
	//console.log('🔄 OMR-UI immersion c2')

	const { mode } = get_game_instance().view.get()

	return (
		<View mode={mode} />
	)
}

function render_c1(omr) {
	//console.log('🔄 OMR-UI immersion c1')

	return (
		<Fragment>
			<OMRUINotifier enqueueNotification={omr.enqueueNotification}/>
			<AppStateContext.Consumer>
				{render_c2}
			</AppStateContext.Consumer>
		</Fragment>
	)
}

export default () => (
	<OhMyRPGUIContext.Consumer>
		{render_c1}
	</OhMyRPGUIContext.Consumer>
)
