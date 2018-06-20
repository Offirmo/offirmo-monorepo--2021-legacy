import React, { Component } from 'react';

import { OhMyRpgUI } from '@oh-my-rpg/view-browser-react'

import MainArea from '../main-area'

import './index.css'

export default class TheBoringRPG extends Component {
	render() {
		// 				universeAnchor={"TODO UniverseAnchor"}
		return (
			<OhMyRpgUI

				logo={"My first clicker"}

				aboutContent={"TODO about"}

				hamburgerPanelContent={"TODO MetaPanel"}

				bottomMenuItems={[]}>

				<div className="omr⋄content-area">
					<MainArea />
				</div>
			</OhMyRpgUI>
		)
	}
}
