import React from 'react'
import classNames from 'classnames'

import { AutoScrollDown } from '../../atoms/auto-scroll-down'


function ChatBubble({direction = 'ltr', children}) {
	const classes = classNames(
		'chat__bubble',
		{ 'chat__bubble--ltr': direction === 'ltr'},
		{ 'chat__bubble--rtl': direction === 'rtl'},
	)
	return (
		<div className={classes}>
			{children}
		</div>
	)
}


function Chat({children}) {
	return (
		<AutoScrollDown>
			{children}
		</AutoScrollDown>
	)
}


export {
	ChatBubble,
	Chat,
}
