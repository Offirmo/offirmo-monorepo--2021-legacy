import React from 'react'

import './index.css'


const OMRUniverseAnchorView = React.memo(
	function OMRUniverseAnchorView({onClick, name, klass, level}) {
		if (window.XOFF.flags.debug_render) console.log('🔄 OMRUniverseAnchorView')

		return (
			<div className="o⋄flex--row" onClick={onClick}>
				<span className="icomoon-user status⁚avatar--icon" />
				<div className="status⁚avatar--details o⋄flex--column">
					<span>{name}</span>
					<span className="status⁚avatar--klass">{klass} L.{level}</span>
				</div>
			</div>
		)
	}
)

export default OMRUniverseAnchorView
