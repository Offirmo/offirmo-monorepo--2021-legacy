import React from 'react'
import { NavLink } from 'react-router-dom'

import { ROUTES } from '../routes'

function Nav() {
	return (
		<nav className='tbrpg__nav clickable-area'>
			<ul className='tbrpg__nav__list'>
				<li>
					<NavLink exact activeClassName='active' to={ROUTES.home}>Home</NavLink>
				</li>
				<li>
					<NavLink activeClassName='active' to={ROUTES.inventory}>Inventory</NavLink>
				</li>
				<li>
					<NavLink activeClassName='active' to={ROUTES.character}>Character</NavLink>
				</li>
				<li>
					<NavLink activeClassName='active' to={ROUTES.meta}>Meta</NavLink>
				</li>
			</ul>
		</nav>
	)
}

export {
	Nav,
}
