import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, NavLink } from 'react-router-dom'

import UniverseAnchor from '../universe-anchor'
import {BASE_ROUTE, ROUTES} from '../../services/routes'
//import { Home } from './components/pages/home'
import ExplorePane from '../chats/explore'
import MetaPane from '../chats/meta'

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


import OhMyRpg from '../oh-my-rpg-ui'

import './index.css';
import logo from './tbrpg_logo_512x98.png';




export default class TheBoringRPG extends Component {
	render() {
		return (
			<Router basename={BASE_ROUTE}>
				<OhMyRpg

					logo={<a href="https://www.online-adventur.es/the-boring-rpg/" target="_blank"><img src={logo} height="100%" /></a>}

					universeAnchor={<UniverseAnchor />}

					hamburgerPanel={<MetaPane />}

					bottomMenuItems={[
						<NavLink key="story" exact className="omr⋄bottom-menu⁚icon" activeClassName='active' to={ROUTES.home}>
							<span className="icomoon-treasure-map" />
						</NavLink>,
						<NavLink key="character" className="omr⋄bottom-menu⁚icon" activeClassName='active' to={ROUTES.character}>
							<span className="icomoon-battle-gear" />
						</NavLink>,
						<NavLink key="inventory" className="omr⋄bottom-menu⁚icon" activeClassName='active' to={ROUTES.inventory}>
							<span className="omr⋄bottom-menu⁚icon icomoon-locked-chest" />
						</NavLink>,
						<span key="chat" className="omr⋄bottom-menu⁚icon icomoon-conversation" />,
					]}
				>
					<div key="background-picture"
						className="omr⋄plane⁚immersion omr⋄full-size-fixed-layer omr⋄bg⁚cover tbrpg⋄bg-image⁚fields_of_gold">
						<div key="content-area" className="omr⋄content-area">
						{
							<ExplorePane />
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
						}
						</div>
					</div>
				</OhMyRpg>
			</Router>
		)
	}
}
