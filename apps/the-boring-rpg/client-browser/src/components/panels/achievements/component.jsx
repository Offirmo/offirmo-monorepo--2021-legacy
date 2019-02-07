import React from 'react'

import { render_achievements_snapshot } from '@oh-my-rpg/view-rich-text'

import rich_text_to_react from '../../../services/rich-text-to-react'
import './index.css'


const AchievementsPanelViewM = React.memo(
	function AchievementsPanelView({achievements_snapshot}) {
		console.log('🔄 AchievementsPanelView')

		return (
			<div className="o⋄top-container tbrpg-panel tbrpg-panel--inventory o⋄flex--column">
				<div className='panel-top-content o⋄flex-element--nogrow'>
					{rich_text_to_react(render_achievements_snapshot(achievements_snapshot))}
				</div>
			</div>
		)
	}
)

export default AchievementsPanelViewM
