import * as React from 'react'
import PropTypes from 'prop-types'

import { render_full_inventory } from '@oh-my-rpg/view-rich-text'

import rich_text_to_react from '../../../services/rich-text-to-react'

import '../index.css'
import './index.css'


const InventoryPanelViewM = React.memo(
	function InventoryPanelView({ inventory, wallet }) {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 InventoryPanelView')

		return (
			<div className="o⋄top-container tbrpg-panel tbrpg-panel--inventory o⋄flex--directionꘌcolumn">
				<div className="panel-top-content o⋄flex-element--nogrow o⋄bg-colorꘌbackdrop">
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
