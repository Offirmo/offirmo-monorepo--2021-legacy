import React from 'react'

//import { render_full_inventory } from '@oh-my-rpg/view-rich-text'

//import rich_text_to_react from '../../../services/rich-text-to-react'
import './index.css'


export default class Component extends React.Component {
	render() {
		const { game_instance } = this.props
		const state = game_instance.get_latest_state()

		return (
			<div className={'tbrpg-panel tbrpg-panel--achievements o⋄flex--column'}>
				<div className='panel-top-content o⋄flex-element--nogrow o⋄text-align⁚center'>
					Achievements will be here one day.<br />
					<a href="https://linktr.ee/theboringrpg" target="_blank" rel="noopener noreferrer">Please encourage the author if you want to see them faster!</a>
				</div>
			</div>
		)
	}
}
