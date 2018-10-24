import React, { Component, Fragment } from 'react';

import OhMyRpg from '@oh-my-rpg/view-browser-react'

import About from './omr-about'
import UniverseAnchor from './omr-universe-anchor'
import MainArea from './omr-immersion'
import HamburgerArea from './omr-hamburger'
import * as GroupChat from './group-chat-tlkio'

import './index.css';
import logo from './tbrpg_logo_512x98.png';

const MODE_TO_INDEX = {
	'explore': 0,
	'inventory': 1,
	'character': 2,
	'achievements': 3,
	'social': 4,
}

export default class TheBoringRPG extends Component {
	state = {
		chat_nickname: 'anonymous',
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const new_state = nextProps.game_instance.model.get_state()
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
		this.props.game_instance.view.set_state(() => ({
			mode: panel_id,
		}))
	}

	toggle_character_panel = () => {
		const { mode } = this.props.game_instance.view.get_state()
		this.activate_panel(mode === 'explore' ? 'character' : 'explore')
	}

	render() {
		const { mode } = this.props.game_instance.view.get_state()

		return (
			<OhMyRpg

				logo={
					<a href="https://www.online-adventur.es/the-boring-rpg/" target="_blank" rel="noopener noreferrer">
						<img src={logo} height="100%" />
					</a>
				}
				aboutContent={<About />}

				universeAnchor={<UniverseAnchor onClick={this.toggle_character_panel} />}

				burgerPanelContent={<HamburgerArea />}

				bottomMenuItems={[
					<span key="explore" className="omr⋄bottom-menu⁚icon icomoon-treasure-map"
							onClick={() => this.activate_panel('explore')} />,
					<span key="inventory" className="omr⋄bottom-menu⁚icon icomoon-cash"
							onClick={() => this.activate_panel('inventory')} />,
					<span key="character" className="omr⋄bottom-menu⁚icon icomoon-battle-gear"
							onClick={() => this.activate_panel('character')} />,
					<span key="achievements" className="omr⋄bottom-menu⁚icon icomoon-laurel-crown"
							onClick={() => this.activate_panel('achievements')} />,
					<span key="social" className="omr⋄bottom-menu⁚icon icomoon-eagle-emblem"
							onClick={() => this.activate_panel('social')} />,
					<span key="chat" className="omr⋄bottom-menu⁚icon icomoon-conversation"
							onClick={() => GroupChat.toggle()} />,
				]}

				bottomMarkerIndex={MODE_TO_INDEX[mode]}
			>
				<MainArea />}
			</OhMyRpg>
		)
	}
}
