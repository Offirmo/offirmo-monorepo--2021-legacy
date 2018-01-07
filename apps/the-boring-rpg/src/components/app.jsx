import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Nav } from './molecules/nav'
import { Home } from './pages/home'
import { Inventory } from './pages/inventory'
import { CharacterSheet } from './pages/character-sheet'
import { Meta } from './pages/meta'
import { Dummy } from './atoms/dummy'
import { BASE_ROUTE, ROUTES } from "./routes"

import './index.css'

class App extends React.Component {
	render() {
		return (
			<Router  basename={BASE_ROUTE}>
				<div className='container'>
					<Nav/>
					<Switch>
						<Route exact path={ROUTES.home} render={() => <Home workspace={this.props.workspace} />} />
						<Route path={ROUTES.inventory} render={() => <Inventory workspace={this.props.workspace} />} />
						<Route path={ROUTES.character} render={() => <CharacterSheet workspace={this.props.workspace} />} />
						<Route path={ROUTES.meta} render={() => <Meta workspace={this.props.workspace} />} />
						<Route render={() => <p>Not Found</p>} />
					</Switch>
				</div>
			</Router>
		)
	}
}

export {
	App,
}
