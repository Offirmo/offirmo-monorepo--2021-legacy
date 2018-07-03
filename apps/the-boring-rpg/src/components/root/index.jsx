import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, NavLink } from 'react-router-dom'

import {BASE_ROUTE, ROUTES} from '../../services/routes'

import Game from '../omr-root'
import DevArea from '../dev-area'

export default class Root extends Component {
	render() {
		return (
			<Fragment>
				<Router basename={BASE_ROUTE}>
					<Switch>
						<Route exact path={ROUTES.home} render={() => <Game />} />

						{ /* fallback to home */ }
						<Redirect to={ROUTES.home} />
					</Switch>
				</Router>
				<DevArea />
			</Fragment>
		)
	}
}


/*
function Nav() {
return (
<nav className='tbrpg__nav o⋄text-noselect'>
   <ul className='o⋄nav-list'>
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
           <NavLink activeClassName='active' to={ROUTES.about}>About</NavLink>
       </li>
   </ul>
</nav>
)
}
*/

/*
                        <Switch>
                            <Route exact path={ROUTES.home} render={() => <Home />} />
                            { /*<Route path={ROUTES.inventory} render={() => <Inventory />} />
                            <Route path={ROUTES.character} render={() => <CharacterSheet  />} />
                            <Route path={ROUTES.about} render={() => <About />} />

                            <Route path={ROUTES.export_savegame} render={() => <ExportSavegame />} />
                            <Route path={ROUTES.x} render={() => <XPage />} />

                            {// fallback to home }
                            <Redirect to={ROUTES.home} />
                        </Switch>*/
