import React from 'react'
import { set_number_in_favicon } from '@offirmo/favicon-notifications'

import './index.css'

export default function Infobox({energy_float, human_time_to_next, achievement_rate}) {
	console.log({energy_float})
	set_number_in_favicon(energy_float)
	window.set_number_in_favicon = set_number_in_favicon
	return (
		<div className="o⋄box">
			⚡ Energy: {Math.trunc(energy_float)}<br/>
			You can play again in: {energy_float >= 1 ? 'now' : human_time_to_next}<br/>
			Achievements: {achievement_rate}%
		</div>
	)
}

/*
import CircularProgressbar from 'react-circular-progressbar'
<CircularProgressbar percentage={60} />
*/
