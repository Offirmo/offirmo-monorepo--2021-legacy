import React from 'react'
import PropTypes from 'prop-types'

import { render_full_inventory } from '@oh-my-rpg/view-rich-text'

import rich_text_to_react from '../../../services/rich-text-to-react'

import '../index.css'
import './index.css'


const InventoryPanelViewM = React.memo(
	function InventoryPanelView({ inventory, wallet }) {
		if (window.XOFF.flags.debug_render) console.log('🔄 InventoryPanelView')

		return (
			<div className="o⋄top-container tbrpg-panel tbrpg-panel--inventory o⋄flex--column">
				<div className="panel-top-content o⋄flex-element--nogrow">
					{rich_text_to_react(render_full_inventory(inventory, wallet))}
				</div>
				<div>
					{/* unused for now */}
				</div>
			</div>
		)
	},
)

export default InventoryPanelViewM
