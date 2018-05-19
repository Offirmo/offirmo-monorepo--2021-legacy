import React from 'react';

import './index.css'

export default function Component({energy_snapshot, energy_state}) {
	return (
		<button>
			<div className="o⋄flex-column">
				<span className="emoji">⚡</span>
				<span>energy: {energy_snapshot.available_energy}/{energy_state.max_energy}</span>
				{energy_snapshot.human_time_to_next && <span>, next in {energy_snapshot.human_time_to_next}</span>}
			</div>
		</button>
	)
}
