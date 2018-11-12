import React from 'react'

import { render_achievements_snapshot } from '@oh-my-rpg/view-rich-text'

import rich_text_to_react from '../../../services/rich-text-to-react'
import './index.css'


export default class Component extends React.Component {
	render() {
		const { game_instance } = this.props
		//const state = game_instance.model.get_state()

		return (
			<div className={'tbrpg-panel tbrpg-panel--inventory o⋄flex--column'}>
				<div className='panel-top-content o⋄flex-element--nogrow'>
					{rich_text_to_react(render_achievements_snapshot(game_instance.selectors.get_achievements_snapshot()))}
				</div>
			</div>
		)
	}
}
