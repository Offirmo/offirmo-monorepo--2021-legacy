import { Component } from 'react'

import OhMyRpgUI from '@oh-my-rpg/view-browser-react'

import MainArea from '../main-area'

import './index.css'

export default class OhMyRPGUICall extends Component {
	render() {
		// 				universeAnchor={"TODO UniverseAnchor"}
		return (
			<OhMyRpgUI

				logo={'Tree Clicker 🌲 🌳 🌴 '}

				aboutContent={'TODO about'}

				burgerPanelContent={'TODO MetaPanel'}

				bottomMenuItems={[]}>

				<div className="omr⋄content-area">
					<MainArea />
				</div>
			</OhMyRpgUI>
		)
	}
}
