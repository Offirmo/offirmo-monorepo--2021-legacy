import React from 'react';

/*

	<div>
		Hello world
		<ul>
			<li>version: {WI_VERSION}</li>
			<li>process.env.NODE_ENV: {process.env.NODE_ENV}</li>
			<li>ENV: {WI_ENV}</li>
			<li>build date: {WI_BUILD_DATE}</li>
		</ul>
	</div>
 */


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
