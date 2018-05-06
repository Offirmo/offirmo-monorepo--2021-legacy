import React, { Component, Fragment } from 'react';

import UniverseAnchor from './universe-anchor'
import MainContent from './main-content'
import MetaPanel from '../../../panels/meta'
import OhMyRpg from '../../../oh-my-rpg-ui'

import './index.css';
import logo from './tbrpg_logo_512x98.png';


export default class TheBoringRPG extends Component {
	activate_panel = (panel_id) => {
		this.props.game_instance.set_client_state(() => ({
			mode: panel_id,
		}))
	}

	render() {
		const { mode } = this.props.game_instance.get_client_state()

		return (
			<OhMyRpg

				logo={<img src={logo} height="100%" />}
				TODOabout={<a href="https://www.online-adventur.es/the-boring-rpg/" target="_blank"><img src={logo} height="100%" /></a>}

				universeAnchor={<UniverseAnchor onClick={() => this.activate_panel('character')} />}

				hamburgerPanelContent={<MetaPanel />}

				bottomMenuItems={[
					<span key="explore" className="omr⋄bottom-menu⁚icon icomoon-treasure-map"
							onClick={() => this.activate_panel('explore')} />,
					<span key="inventory" className="omr⋄bottom-menu⁚icon icomoon-locked-chest"
							onClick={() => this.activate_panel('inventory')} />,
					<span key="character" className="omr⋄bottom-menu⁚icon icomoon-battle-gear"
							onClick={() => this.activate_panel('character')} />,
					<span key="chat" className="omr⋄bottom-menu⁚icon icomoon-conversation" />,
				]}
			>
				<MainContent />
			</OhMyRpg>
		)
	}
}
