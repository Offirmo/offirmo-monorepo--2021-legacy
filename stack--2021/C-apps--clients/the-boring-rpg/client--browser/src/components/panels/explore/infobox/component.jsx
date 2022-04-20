import * as React from 'react'
import { set_number_in_favicon } from '@offirmo-private/favicon-notifications'

import './index.css'

const InfoboxViewM = React.memo(
	function InfoboxView({ energy_float, human_time_to_next, achievements_completion_pct }) {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 InfoboxView' /*, { energy_float }*/)

		set_number_in_favicon(energy_float)
		//window.set_number_in_favicon = set_number_in_favicon // debug

		return (
			<div className="o⋄box o⋄bg-colorꘌbackdrop">
				⚡ You can play {energy_float >= 1 ? 'right now!' : `in ${human_time_to_next}`} - Energy: {energy_float}/7<br/>
				🏆 Achievements: {achievements_completion_pct}%
			</div>
		)
	},
)

export default InfoboxViewM

/*
import CircularProgressbar from 'react-circular-progressbar'
<CircularProgressbar percentage={60} />
*/
