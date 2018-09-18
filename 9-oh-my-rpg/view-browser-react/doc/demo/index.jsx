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
				aboutContent={'<About>'}

				universeAnchor={'<UniverseAnchor>'}

				hamburgerPanelContent={'<HamburgerArea>'}

				bottomMenuItems={[
					<span key="explore" className="omr⋄bottom-menu⁚icon icomoon-treasure-map" />,
					<span key="inventory" className="omr⋄bottom-menu⁚icon icomoon-locked-chest" />,
					<span key="character" className="omr⋄bottom-menu⁚icon icomoon-battle-gear" />,
					<span key="chat" className="omr⋄bottom-menu⁚icon icomoon-conversation" />,
				]}
			>
				Main area
			</OhMyRpg>
		)
	}
}


const mountNode = document.getElementById('root')
ReactDOM.render(<ViewBrowserReactDemo />, mountNode)
