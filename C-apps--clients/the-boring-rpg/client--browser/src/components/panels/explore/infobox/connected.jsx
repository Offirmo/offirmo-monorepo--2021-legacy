import * as React from 'react'
import PropTypes from 'prop-types'
import Fraction from 'fraction.js'

import get_game_instance from '../../../../services/game-instance-browser'
import { AppStateContext } from '../../../../context'

import InfoboxView from './component'
import ErrorBoundary from "@offirmo-private/react-error-boundary"




const InfoboxC1 = React.memo(
	function InfoboxC1({state}) {
		const game_instance = get_game_instance()
		const achievements_completion_pct = (new Fraction(game_instance.queries.get_achievements_completion())).mul(100).floor(2).valueOf()

		return (
			<InfoboxView
				energy_float={game_instance.queries.get_available_energy_float()}
				human_time_to_next={game_instance.queries.get_human_time_to_next_energy()}
				achievements_completion_pct={achievements_completion_pct}
			/>
		)
	},
)


function InfoBoxC2() {
	//console.log('🔄 InfoboxC2'/*, this.context, get_available_energy_float(this.context.model)*/)

	return (
		<ErrorBoundary name={'tbrpg:infobox'}>
			<AppStateContext.Consumer>
				{app_state => {
					//console.log('InfoboxC2 context received:', app_state)
					return <InfoboxC1 m_state={app_state.model} />
				}}
			</AppStateContext.Consumer>
		</ErrorBoundary>
	)
}


export default InfoBoxC2
