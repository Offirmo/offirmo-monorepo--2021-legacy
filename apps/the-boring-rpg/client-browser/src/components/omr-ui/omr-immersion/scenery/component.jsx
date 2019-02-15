import React, { Component } from 'react'

const SceneryView = React.memo(
	function SceneryView({bg_class}) {
		console.log('🔄 SceneryView')

		return (
			<div key="background" className="omr⋄full-size-fixed-layer omr⋄bg-image⁚tiled-marble_black">
				<div key="background-picture"
					className={`omr⋄full-size-background-layer omr⋄bg⁚cover ${bg_class}`}/>
			</div>
		)
	}
)
export default SceneryView
