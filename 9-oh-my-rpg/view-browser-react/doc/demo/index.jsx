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

				bottomMarkerIndex={0}
			>
				{/* XXX TODO fix imbricated themes */}
				<div className="o⋄top-container omr⋄bg-image⁚parchment-xxl o⋄color⁚main" data-o-theme="dark-on-light">
					Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
				</div>
			</OhMyRpg>
		)
	}
}

/*
				slides={[
					{
						icon: <span key="explore" className="omr⋄bottom-menu⁚icon icomoon-treasure-map" />,
						content: <div>Main area. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>,
					},
					{
						icon: <span key="inventory" className="omr⋄bottom-menu⁚icon icomoon-locked-chest" />,
						content: <div>Main area. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>,
					},
					{
						icon: <span key="character" className="omr⋄bottom-menu⁚icon icomoon-battle-gear" />,
						content: <div>Main area. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>,
					},
					{
						icon: <span key="chat" className="omr⋄bottom-menu⁚icon icomoon-conversation" />,
					},
 */
// logo={<img src={logo} height="100%" />}

const mountNode = document.getElementById('root')
ReactDOM.render(<ViewBrowserReactDemo />, mountNode)
