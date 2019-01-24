import React from 'react'
import PropTypes from 'prop-types'

import { render_full_inventory } from '@oh-my-rpg/view-rich-text'

import rich_text_to_react from '../../../services/rich-text-to-react'

import './index.css'


const InventoryPanelViewM = React.memo(
	function InventoryPanelView({ inventory, wallet }) {
		console.log('🔄 InventoryPanelView')

		return (
			<div className={'tbrpg-panel tbrpg-panel--inventory o⋄flex--column'}>
				<div className='panel-top-content o⋄flex-element--nogrow'>
					{rich_text_to_react(render_full_inventory(inventory, wallet))}
					{ /* <hr/> */ }
				</div>
				<div className='o⋄flex-element--grow o⋄overflow-y⁚auto'>
					{ /*<ErrorBoundary name={'chat:explore'}><Chat gen_next_step={this.gen_next_step()} />*/ }
				</div>
			</div>
		)
	}
)
