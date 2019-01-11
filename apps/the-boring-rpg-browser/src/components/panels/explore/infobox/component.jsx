import React from 'react'
import { set_number_in_favicon } from '@offirmo/favicon-notifications'

import './index.css'

export default React.memo(
	function InfoboxView({energy_float, human_time_to_next, achievement_rate}) {
		console.log('🔄 InfoboxView', {energy_float})

		set_number_in_favicon(energy_float)
		//window.set_number_in_favicon = set_number_in_favicon // debug

		return (
			<div className="o⋄box">
				⚡ Energy: {energy_float} → You can play again {energy_float >= 1 ? 'right now!' : `in ${human_time_to_next}`}<br/>
				🏆 Achievements: {achievement_rate}%
			</div>
		)
	}
)

/*
import CircularProgressbar from 'react-circular-progressbar'
<CircularProgressbar percentage={60} />
*/
