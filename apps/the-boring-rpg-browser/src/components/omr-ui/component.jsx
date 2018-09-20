import React, { Component, Fragment } from 'react';

import OhMyRpg from '@oh-my-rpg/view-browser-react'

import About from './omr-about'
import UniverseAnchor from './omr-universe-anchor'
import MainArea from './omr-immersion'
import HamburgerArea from './omr-hamburger'
import * as GroupChat from './group-chat-tlkio'

import './index.css';
import logo from './tbrpg_logo_512x98.png';


export default class TheBoringRPG extends Component {
	state = {
		chat_nickname: 'anonymous',
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const new_state = nextProps.game_instance.get_latest_state()
		const avatar_name = new_state.avatar.name
		if (avatar_name === prevState.chat_nickname)
			return null // no update needed

		//console.info('omr-root: getDerivedStateFromProps: change detected', avatar_name)
		return {
			chat_nickname: avatar_name,
		}
	}

	componentDidMount() {
		//console.log('omr-root: componentDidMount')
		GroupChat.restart({
			channel_id: 'the-boring-rpg-reloaded',
			nickname: this.state.chat_nickname,
		})
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.chat_nickname !== this.state.chat_nickname) {
			console.info('omr-root: componentDidUpdate: restarting group chat...')
			GroupChat.restart({
				channel_id: 'the-boring-rpg-reloaded',
				nickname: this.state.chat_nickname,
			})
		}
	}

	activate_panel = (panel_id) => {
		this.props.game_instance.set_client_state(() => ({
			mode: panel_id,
		}))
	}

	render() {
		return (
			<OhMyRpg

				logo={<img src={logo} height="100%" />}
				aboutContent={<About />}

				universeAnchor={<UniverseAnchor onClick={() => this.activate_panel('character')} />}

				burgerPanelContent={<HamburgerArea />}

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
				<MainArea />
			</OhMyRpg>
		)
	}
}