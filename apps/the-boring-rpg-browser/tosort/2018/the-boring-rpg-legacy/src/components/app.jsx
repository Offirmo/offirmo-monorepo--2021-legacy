import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch, NavLink } from 'react-router-dom'

import { Header } from './organisms/header'
import { Home } from './pages/home'
import { Inventory } from './pages/inventory'
import { CharacterSheet } from './pages/character-sheet'
import { About } from './pages/about'
import { ExportSavegame } from './pages/export-savegame'
import { XPage } from './pages/x'
import { BASE_ROUTE, ROUTES } from "./routes"

class App extends React.Component {
	render() {
		return (
			<Router basename={BASE_ROUTE}>
				<div className="o⋄top-container omr⋄font-family⁚pixantiqua omr-tbrpg-theme">

					<div className="omr⋄full-size-background-layer omr⋄bg-image⁚tiled-marble_black"></div>

					<div className="omr⋄full-size-fixed-layer omr⋄bg⁚cover"></div>

					<div className="omr⋄top-hud">
						<div className="omr⋄hamburger">
							<span className="icomoon-menu"></span>
						</div>

						<div className="omr⋄logo">
							<span>The boring RPG</span>
						</div>

						<div className="omr⋄status⁚user">
							<span class="icomoon-user"></span>
							Pertenax, paladin L.28
						</div>

						<div className="omr⋄status⁚location">
							<span class="icomoon-person_pin_circle"></span>
						</div>
					</div>

					<div id="tbrpg-root" className="o⋄top-container o⋄centered-article">
						<Header/>

						<Switch>
							<Route exact path={ROUTES.home} render={() => <Home />} />
							<Route path={ROUTES.inventory} render={() => <Inventory />} />
							<Route path={ROUTES.character} render={() => <CharacterSheet  />} />
							<Route path={ROUTES.about} render={() => <About />} />

							<Route path={ROUTES.export_savegame} render={() => <ExportSavegame />} />
							<Route path={ROUTES.x} render={() => <XPage />} />

							{/* fallback to home */}
							<Redirect to={ROUTES.home} />
						</Switch>
					</div>
				</div>
			</Router>
		)
	}
}

export {
	App,
}

// 							<Route render={() => <p>Nothing here. <NavLink exact to={ROUTES.home}>Go home</NavLink></p>} />
