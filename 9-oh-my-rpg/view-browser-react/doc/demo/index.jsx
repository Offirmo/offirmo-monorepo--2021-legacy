import React, { Component, Fragment } from 'react'
import ReactDOM from "react-dom"

import OhMyRpg from '../../src'

import './index.css'
import logo from './tbrpg_logo_512x98.png'


export default class ViewBrowserReactDemo extends Component {

	render() {
		return (
			<OhMyRpg

				logo={<img src={logo} height="100%" />}
				aboutContent={'About'}

				universeAnchor={'UniverseAnchor'}

				hamburgerPanelContent={'<HamburgerArea>'}

				bottomMenuItems={[
					<span key="explore" className="omr⋄bottom-menu⁚icon icomoon-treasure-map"
							onClick={() => this.activate_panel('explore')} />,
					<span key="inventory" className="omr⋄bottom-menu⁚icon icomoon-locked-chest"
							onClick={() => this.activate_panel('inventory')} />,
					<span key="character" className="omr⋄bottom-menu⁚icon icomoon-battle-gear"
							onClick={() => this.activate_panel('character')} />,
					<span key="chat" className="omr⋄bottom-menu⁚icon icomoon-conversation"
							onClick={() => GroupChat.toggle()} />,
				]}
			>
				Main area
			</OhMyRpg>
		)
	}
}


const mountNode = document.getElementById('app')
ReactDOM.render(<ViewBrowserReactDemo />, mountNode)
