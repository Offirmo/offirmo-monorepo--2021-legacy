import React from 'react'
import { set_number_in_favicon } from '@offirmo/favicon-notifications'

import './index.css'

export default function Infobox({energy_float, next_energy_human, achievement_rate}) {
	set_number_in_favicon(energy_float)
	window.set_number_in_favicon = set_number_in_favicon
	return (
		<div className="o⋄box">
			⚡ Energy: {Math.trunc(energy_float)}<br/>
			You can play again in: {energy_float >= 1 ? 'now' : next_energy_human}<br/>
			Achievements: {achievement_rate}%
		</div>
	)
}
