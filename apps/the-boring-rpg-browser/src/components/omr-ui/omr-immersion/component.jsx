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

export default class MainArea extends Component {

	componentDidMount() {
		//console.log('MainArea: componentDidMount')

		this.props.omr.enqueueNotification({
			level: 'warning',
			children: <span className="warning">⚠ Warning! This game is alpha, your savegame may be lost at any time!</span>,
			position: 'top-center',
			auto_dismiss_delay_ms: 10000,
		})
	}


	render() {
		const {mode, background} = this.props

		const bg_class = `tbrpg⋄bg-image⁚${background}`
		return (
			<div className="omr⋄content-area main-area">

				<div key="background" className="omr⋄full-size-fixed-layer omr⋄bg-image⁚tiled-marble_black">
					<div key="background-picture"
						  className={`omr⋄full-size-background-layer omr⋄bg⁚cover ${bg_class}`}/>
				</div>

				<div key="content-area" className="o⋄pos⁚rel o⋄top-container o⋄centered-article">
					{MODE_TO_PANEL[mode] || <ExplorePanel/>}
				</div>
			</div>
		)
	}
}
