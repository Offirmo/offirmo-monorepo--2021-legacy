import React from 'react'

import ActionButton from '../action-button'

import './index.css'

export default ({children, actions}) => (
	<span className="tbrpg-element">
			{children}
			{actions.length
				? actions.map(action => (<ActionButton key={action.type} action={action} />))
				: <br />}
	</span>
)
