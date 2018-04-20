import React from 'react';


export default function UniverseAnchor({name, klass, level}) {
	return (
		<div className="o⋄flex-row">
			<span className="icomoon-user status⁚avatar--icon" />
			<div className="status⁚avatar--details o⋄flex-column">
				<span>{name}</span>
				<span>{klass} L.{level}</span>
			</div>
		</div>
	)
}
