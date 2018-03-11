import React from 'react'

import { Nav } from '../molecules/nav'

function Header() {
	return (
		<div className='tbrpg__header o⋄flex-column'>
			<div className='tbrpg__header__logo o⋄flex-row'>
				<img src="assets/favicons/favicon-72x72.png" height="24" width="24"/>
				<div className='tbrpg__header__title'>The Boring RPG <small><i>reloaded</i></small></div>
			</div>
			<Nav/>
		</div>
	)
}

export {
	Header,
}
