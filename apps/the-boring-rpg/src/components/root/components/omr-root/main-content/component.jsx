import React from 'react';
import { once } from 'lodash'

import ExplorePanel from '../../../../panels/explore'
import CharacterPanel from '../../../../panels/character'
import InventoryPanel from '../../../../panels/inventory'

import './index.css'

const MODE_TO_PANEL = {
	'explore': <ExplorePanel />,
	'character': <CharacterPanel />,
	'inventory': <InventoryPanel />,
}

export default function UniverseAnchor({mode, is_chat_open}) {
	return (
		<div key="background-picture"
			  className="omr⋄plane⁚immersion omr⋄full-size-fixed-layer omr⋄bg⁚cover tbrpg⋄bg-image⁚fields_of_gold">

			<div key="content-area" className="omr⋄content-area">
				{MODE_TO_PANEL[mode] || <ExplorePanel />}
			</div>

		</div>
	)
}
