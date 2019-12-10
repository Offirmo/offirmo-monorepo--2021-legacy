import React, { Component } from 'react'

import { render_artwork_legend } from '@oh-my-rpg/rsrc-backgrounds'
import rich_text_to_react from '../../../../services/rich-text-to-react'

import './index.css'


const SceneryView = React.memo(
	function SceneryView({bg, next_bg}) {
		if (window.XOFF.flags.debug_render) console.log('🔄 SceneryView')

		return (
			<div key="background" className="omr⋄full-size-fixed-layer omr⋄bg-image⁚tiled-marble_black">
				<div key="background-picture"
					className={`omr⋄full-size-background-layer omr⋄bg⁚cover ${bg.css_class}`}>
					<div className="scenery__legend">
						{rich_text_to_react(render_artwork_legend(bg))}
					</div>
				</div>
				<div key="next-background-picture" className={`scenery__prefetch ${next_bg.css_class}`} />
			</div>
		)
	},
)
export default SceneryView
