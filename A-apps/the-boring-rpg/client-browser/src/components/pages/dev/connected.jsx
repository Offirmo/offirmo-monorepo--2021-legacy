import * as React from 'react'
import PropTypes from 'prop-types'

import View from './component'
import get_game_instance from '../../../services/game-instance-browser'


const PageDev = React.memo(
	function PageDevC1() {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 PageDevC1')

		const state = get_game_instance().model.get()
		const view_state = get_game_instance().view.get()

		return (
			<View
				state={state}
				view_state={view_state}
			/>
		)
	},
)

export default PageDev
