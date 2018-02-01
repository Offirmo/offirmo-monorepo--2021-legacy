import React from 'react'

import { Nav } from '../molecules/nav'

function Header() {
	return (
		<div className='tbrpg__header'>
			<img src="../../assets/favicons/favicon-96x96.png" height="24" width="24"/>
			<Nav/>
		</div>
	)
}

export {
	Header,
}
