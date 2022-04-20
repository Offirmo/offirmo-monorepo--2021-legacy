import * as React from 'react'
import { Component } from 'react'

import ExplorePanel from '../../panels/explore'
import CharacterPanel from '../../panels/character'
import InventoryPanel from '../../panels/inventory'
import AchievementsPanel from '../../panels/achievements'
import SocialPanel from '../../panels/social'

import Scenery from './scenery'
import './index.css'

const MODE_TO_PANEL = {
	'explore': <ExplorePanel />,
	'character': <CharacterPanel />,
	'inventory': <InventoryPanel />,
	'achievements': <AchievementsPanel />,
	'social': <SocialPanel />,
}

const MainAreaView = React.memo(
	function MainAreaView({mode}) {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 MainAreaView')

		return (
			<div className="omr⋄content-area o⋄top-container main-area omr⋄cursorꘌsword--standard">

				<Scenery />

				<div key="content-area" className="o⋄positionꘌrelative o⋄top-container o⋄centered-article omr⋄content-area--inner">
					{MODE_TO_PANEL[mode] || <ExplorePanel/>}
				</div>
			</div>
		)
	},
)
export default MainAreaView
