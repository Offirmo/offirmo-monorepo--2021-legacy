import React from 'react';

import ExplorePanel from '../panels/explore'
import CharacterPanel from '../panels/character'
import InventoryPanel from '../panels/inventory'
//import EnergyIndicator from '../../../../energy-indicator'

import './index.css'

const MODE_TO_PANEL = {
	'explore': <ExplorePanel />,
	'character': <CharacterPanel />,
	'inventory': <InventoryPanel />,
}

export default function MainArea({mode, is_chat_open}) {
	return (
		<div className="omr⋄content-area main-area">

			<div key="background" className="omr⋄full-size-fixed-layer">
				{/*<div key="background-layer"
					className="omr⋄full-size-background-layer omr⋄bg-image⁚tiled-marble_black" />*/}

				<div key="background-picture"
					className="omr⋄full-size-background-layer omr⋄bg⁚cover tbrpg⋄bg-image⁚fields_of_gold" />
			</div>

			<div key="content-area" className="o⋄pos⁚rel o⋄top-container o⋄centered-article">
				{MODE_TO_PANEL[mode] || <ExplorePanel />}
			</div>

			{/*<EnergyIndicator />*/}
		</div>
	)
}
