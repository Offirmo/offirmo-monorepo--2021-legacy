import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, NavLink } from 'react-router-dom'

import {BASE_ROUTE, ROUTES} from './components/routes'
import { Home } from './components/pages/home'

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


import OhMyRpg from '../oh-my-rpg'

import './index.css';
import logo from './tbrpg_logo_512x98.png';

function UniverseAnchor({name, klass, level}) {
	return (
		<div className="o⋄flex-row">
			<span className="icomoon-user status⁚avatar--icon" />
			<div className="status⁚avatar--details o⋄flex-column">
				<span>{name}</span>
				<span>{klass} L.{level}</span>
			</div>
		</div>
	)
}


export default class TheBoringRPG extends Component {
	render() {
		//  {/*  basename={BASE_ROUTE}*/}
		return (
			<Router>
				<OhMyRpg

					logo={<img src={logo} height="100%" />}

					universeAnchor={
						<UniverseAnchor
							name={'Pertenax'}
							klass={'Paladin'}
							level={28}
						/>
					}
					hamburgerItems={[]}
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
					<div key="background-picture" className="omr⋄full-size-fixed-layer omr⋄bg⁚cover tbrpg⋄bg-image⁚fields_of_gold">
						<Switch>
							<Route exact path={ROUTES.home} render={() => <Home />} />
							{ /*<Route path={ROUTES.inventory} render={() => <Inventory />} />
							<Route path={ROUTES.character} render={() => <CharacterSheet  />} />
							<Route path={ROUTES.about} render={() => <About />} />

							<Route path={ROUTES.export_savegame} render={() => <ExportSavegame />} />
							<Route path={ROUTES.x} render={() => <XPage />} /> */}

							{/* fallback to home */}
							<Redirect to={ROUTES.home} />
						</Switch>
					</div>
				</OhMyRpg>
			</Router>
		);
	}
}
