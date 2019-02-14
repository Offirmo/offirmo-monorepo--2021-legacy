import React, { Component } from 'react'

import ExplorePanel from '../../panels/explore'
import CharacterPanel from '../../panels/character'
import InventoryPanel from '../../panels/inventory'
import AchievementsPanel from '../../panels/achievements'
import SocialPanel from '../../panels/social'

import './index.css'

const MODE_TO_PANEL = {
	'explore': <ExplorePanel />,
	'character': <CharacterPanel />,
	'inventory': <InventoryPanel />,
	'achievements': <AchievementsPanel />,
	'social': <SocialPanel />,
}

const MainAreaView = React.memo(
	function MainAreaView({mode, background}) {
		console.log('🔄 MainAreaView')

		const bg_class = `tbrpg⋄bg-image⁚${background}`
		return (
			<div className="omr⋄content-area o⋄top-container main-area">

				<div key="background" className="omr⋄full-size-fixed-layer omr⋄bg-image⁚tiled-marble_black">
					<div key="background-picture"
						  className={`omr⋄full-size-background-layer omr⋄bg⁚cover ${bg_class}`}/>
				</div>

				<div key="content-area" className="o⋄pos⁚rel o⋄top-container o⋄centered-article omr⋄content-area--inner">
					{MODE_TO_PANEL[mode] || <ExplorePanel/>}
				</div>
			</div>
		)
	}
)
export default MainAreaView
