import React, { Component, Fragment } from 'react'

import {THE_BORING_RPG} from '@offirmo/marketing-rsrc'

import ExplorePanel from '../../panels/explore'
import CharacterPanel from '../../panels/character'
import InventoryPanel from '../../panels/inventory'
import AchievementsPanel from '../../panels/achievements'
import SocialPanel from '../../panels/social'

import './index.css'
import SEC from '../../../services/sec'
import {LS_KEYS} from '../../../services/consts'

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
			auto_dismiss_delay_ms: 7000,
		})

		// update notification
		SEC.xTry('update last seen version', ({ VERSION: current_version }) => {
			const last_version_seen = localStorage.getItem(LS_KEYS.last_version_seen)
			if (current_version === last_version_seen) return
			this.props.omr.enqueueNotification({
				level: 'success',
				children: (
					<Fragment>
						🆕 You got a new version!
						Check the <a href={THE_BORING_RPG.changelog} target="_blank">new features</a>!
					</Fragment>
				),
				position: 'top-center',
				auto_dismiss_delay_ms: 7000,
			})
			localStorage.setItem(LS_KEYS.last_version_seen, current_version)
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
