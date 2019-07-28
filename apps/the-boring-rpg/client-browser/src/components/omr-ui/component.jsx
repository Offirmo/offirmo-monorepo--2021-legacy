import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'

import OhMyRpg from '@oh-my-rpg/view-browser-react'

import get_game_instance from '../../services/game-instance-browser'
import About from './omr-about'
import UniverseAnchor from './omr-universe-anchor'
import ImmersionArea from './omr-immersion'
import HamburgerArea from './omr-hamburger'
import * as GroupChat from '../misc/group-chat-tlkio'


import './index.css'
import logo from './tbrpg_logo_512x98.png'

const CHANNEL_ID = 'the-boring-rpg-reloaded'
const MODE_TO_INDEX = {
	'explore': 0,
	'inventory': 1,
	'character': 2,
	'achievements': 3,
	'social': 4,
}

export default class OhMyRPGView extends PureComponent {
	static propTypes = {
		mode: PropTypes.string.isRequired,
		avatar_name: PropTypes.string.isRequired,
	}

	state = {
		chat_nickname: 'anonymous',
	}

	bottomMenuItems = [
		<span key="explore" className="omr⋄bottom-menu⁚icon icomoon-treasure-map"
				onClick={() => this.activate_panel('explore')}/>,
		<span key="inventory" className="omr⋄bottom-menu⁚icon icomoon-cash"
				onClick={() => this.activate_panel('inventory')}/>,
		<span key="character" className="omr⋄bottom-menu⁚icon icomoon-battle-gear"
				onClick={() => this.activate_panel('character')}/>,
		<span key="achievements" className="omr⋄bottom-menu⁚icon icomoon-laurel-crown"
				onClick={() => this.activate_panel('achievements')}/>,
		<span key="social" className="omr⋄bottom-menu⁚icon icomoon-eagle-emblem"
				onClick={() => this.activate_panel('social')}/>,
		<span key="chat" className="omr⋄bottom-menu⁚icon icomoon-conversation"
				onClick={() => GroupChat.toggle()}/>,
	]

	static getDerivedStateFromProps(nextProps, prevState) {
		const avatar_name = nextProps.avatar_name
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
			channel_id: CHANNEL_ID,
			nickname: this.state.chat_nickname,
		})
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.chat_nickname !== this.state.chat_nickname) {
			// TODO this doesn't seem to work
			console.info('omr-root: componentDidUpdate: restarting group chat...')
			GroupChat.restart({
				channel_id: CHANNEL_ID,
				nickname: this.state.chat_nickname,
			})
		}
	}

	activate_panel = (panel_id) => {
		get_game_instance().view.set_state(() => ({
			mode: panel_id,
		}))
	}

	toggle_character_panel = () => {
		const { mode } = this.props
		this.activate_panel(mode === 'explore' ? 'character' : 'explore')
	}

	render() {
		const { mode } = this.props
		if (window.XOFF.flags.debug_render) console.log('🔄 OhMyRPGView')

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

				bottomMenuItems={this.bottomMenuItems}

				bottomMarkerIndex={MODE_TO_INDEX[mode]}
			>
				<ImmersionArea />
			</OhMyRpg>
		)
	}
}
