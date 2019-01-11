import React from 'react'
import Fraction from 'fraction.js'

import { get_available_energy_float } from '@oh-my-rpg/state-the-boring-rpg'

import get_game_instance from '../../../../services/game-instance-browser'
import AppStateContext from '../../../../context/app-state'

import InfoboxView from './component'


const game_instance = get_game_instance()


const InfoboxC1 = React.memo(
	function InfoboxC1({m_state}) {
		console.log('🔄 InfoboxC1' /*, m_state*/)

		const ach_completion = (new Fraction(game_instance.selectors.get_achievements_completion())).floor(2).valueOf()

		return (
			<InfoboxView
				energy_float={game_instance.selectors.get_available_energy_float()}
				human_time_to_next={game_instance.selectors.get_human_time_to_next_energy()}
				achievement_rate={ach_completion}
			/>
		)
	}
)


function InfoBoxC2() {
	console.log('🔄 InfoboxC2'/*, this.context, get_available_energy_float(this.context.model)*/)

	return (
		<AppStateContext.Consumer>
			{app_state => {
				//console.log('InfoboxC2 context received:', app_state)
				return <InfoboxC1 m_state={app_state.model} />
			}}
		</AppStateContext.Consumer>
	)
}


export default InfoBoxC2
