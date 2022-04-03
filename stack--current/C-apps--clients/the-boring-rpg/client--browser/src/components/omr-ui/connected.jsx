import PropTypes from 'prop-types'

import get_game_instance from '../../services/game-instance-browser'
import { AppStateContext } from '../../context'

import View from './component'



function OMRUI() {
	//console.log('🔄 OMRUI')

	return (
		<AppStateContext.Consumer>
			{app_state => {
				const { mode } = get_game_instance().view.get()
				const avatar_name = get_game_instance().queries.get_sub_state('avatar').name

				return (
					<View
						mode={mode}
						avatar_name={avatar_name}
					/>
				)
			}}
		</AppStateContext.Consumer>
	)
}


export default OMRUI
