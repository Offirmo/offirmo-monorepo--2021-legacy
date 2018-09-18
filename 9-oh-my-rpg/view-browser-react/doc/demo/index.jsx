import React, { Component, Fragment } from 'react'
import ReactDOM from "react-dom"

import OhMyRpg from '../../src'

import './index.css'
//import logo from './tbrpg_logo_512x98.png'


export default class ViewBrowserReactDemo extends Component {

	render() {
		return (
			<OhMyRpg

				logo={'<logo>'}

				aboutContent={'<About>'}

				universeAnchor={'<UniverseAnchor>'}

				burgerPanelContent={'<BurgerArea>'}

				bottomMenuItems={[
					<span key="explore" className="omr⋄bottom-menu⁚icon icomoon-treasure-map" />,
					<span key="inventory" className="omr⋄bottom-menu⁚icon icomoon-locked-chest" />,
					<span key="character" className="omr⋄bottom-menu⁚icon icomoon-battle-gear" />,
					<span key="chat" className="omr⋄bottom-menu⁚icon icomoon-conversation" />,
				]}
			>
				Main area. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
			</OhMyRpg>
		)
	}
}

// logo={<img src={logo} height="100%" />}

const mountNode = document.getElementById('root')
ReactDOM.render(<ViewBrowserReactDemo />, mountNode)
