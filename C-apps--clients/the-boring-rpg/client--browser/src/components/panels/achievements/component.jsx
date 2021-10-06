import * as React from 'react'

import { render_achievements_snapshot } from '@oh-my-rpg/view-rich-text'

import rich_text_to_react from '../../../services/rich-text-to-react'
import '../index.css'
import './index.css'


const AchievementsPanelViewM = React.memo(
	function AchievementsPanelView({achievements_snapshot}) {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 AchievementsPanelView')

		return (
			<div className="o⋄top-container tbrpg-panel tbrpg-panel--achievements o⋄flex--directionꘌcolumn">
				<div className="panel-top-content o⋄flex-element--nogrow o⋄bg-colorꘌbackdrop">
					{rich_text_to_react(render_achievements_snapshot(achievements_snapshot))}
				</div>
			</div>
		)
	},
)

export default AchievementsPanelViewM
