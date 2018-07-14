import React from 'react'

import './index.css'

/////////////////////

export default ({
						 count = 0,
							should_display = () => true,
						 children,
					 }) => (
	should_display() && (
		<div className={'notification-indicator'}>
			{count}
		</div>
	)
)
