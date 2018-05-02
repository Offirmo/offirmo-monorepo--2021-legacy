import React, { Component, Fragment } from 'react';

import UniverseAnchor from '../../../universe-anchor'
import ExplorePanel from '../../../panels/explore'
import CharacterPanel from '../../../panels/character'
import InventoryPanel from '../../../panels/inventory'
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
				about={<a href="https://www.online-adventur.es/the-boring-rpg/" target="_blank"><img src={logo} height="100%" /></a>}

				universeAnchor={<UniverseAnchor onClick={() => this.activate_panel('character')} />}

				hamburgerPanel={<MetaPanel />}

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
				<div key="background-picture"
					className="omr⋄plane⁚immersion omr⋄full-size-fixed-layer omr⋄bg⁚cover tbrpg⋄bg-image⁚fields_of_gold">
					<div key="content-area" className="omr⋄content-area">
						{(mode => {switch(mode) {
							case 'explore':
								return <ExplorePanel />
								break
							case 'character':
								return <CharacterPanel />
								break
							case 'inventory':
								return <InventoryPanel />
								break
							default:
								return <ExplorePanel />
								break
						}})(mode)}
					</div>
				</div>
			</OhMyRpg>
		)
	}
}
