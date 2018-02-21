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

//import './index.css'

class App extends React.Component {
	render() {
		return (
			<Router  basename={BASE_ROUTE}>
				<div className='tbrpg-container full-viewport-height'>

					<Header/>

					<Switch>
						<Route exact path={ROUTES.home} render={() => <Home />} />
						<Route path={ROUTES.inventory} render={() => <Inventory workspace={this.props.workspace} />} />
						<Route path={ROUTES.character} render={() => <CharacterSheet workspace={this.props.workspace} />} />
						<Route path={ROUTES.about} render={() => <About workspace={this.props.workspace} />} />

						<Route path={ROUTES.export_savegame} render={() => <ExportSavegame />} />
						<Route path={ROUTES.x} render={() => <XPage />} />

						<Redirect to={ROUTES.home} />
					</Switch>
				</div>
			</Router>
		)
	}
}

export {
	App,
}

// 							<Route render={() => <p>Nothing here. <NavLink exact to={ROUTES.home}>Go home</NavLink></p>} />
