import React from 'react'

import ActionButton from '../action-button'

import './index.css'

/////////////////////

export default () => (
	<div className={'play-button'}>
		<ActionButton action={{type: 'play'}}/>
	</div>
)
