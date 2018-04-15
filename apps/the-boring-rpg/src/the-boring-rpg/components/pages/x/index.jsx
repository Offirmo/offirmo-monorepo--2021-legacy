import React from 'react'
import { Route, Switch, NavLink } from 'react-router-dom'

import { ROUTES } from '../../routes'
import { ChatDemo } from './demo-chat'
import { RPGUIDemo } from './demo-rpgui'

function XPage() {
	return (
		<div className={'page page--x'}>
			<div className='page-top-content'>

				<Switch>
					<Route exact path={ROUTES.x} render={() => (
						<ul>
							<li><NavLink exact to={ROUTES.x + '/errors'}>Error handling test (TODO)</NavLink></li>
							<li><NavLink exact to={ROUTES.x + '/chat-demo'}>Chat demo</NavLink></li>
							<li><NavLink exact to={ROUTES.x + '/rpgui-demo'}>RPGUI demo</NavLink></li>
						</ul>
					)} />

					<Route path={ROUTES.x + '/chat-demo'} render={() => <ChatDemo />} />
					<Route path={ROUTES.x + '/rpgui-demo'} render={() => <RPGUIDemo />} />
					<Route render={() => <p>Nothing here. <NavLink exact to={ROUTES.x}>Go back</NavLink></p>} />
				</Switch>
			</div>
		</div>
	)
}

export {
	XPage,
}
