import React from 'react'
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom'

import { Nav } from './molecules/nav'
import { Home } from './pages/home'
import { Inventory } from './pages/inventory'
import { CharacterSheet } from './pages/character-sheet'
import { Meta } from './pages/meta'
import { XPage } from './pages/x'
import { BASE_ROUTE, ROUTES } from "./routes"

//import './index.css'

class App extends React.Component {
	render() {
		return (
			<Router  basename={BASE_ROUTE}>
				<div className='container'>

					<Nav/>

					<div className='route-container'>
						<Switch>
							<Route exact path={ROUTES.home} render={() => <Home workspace={this.props.workspace} />} />
							<Route path={ROUTES.inventory} render={() => <Inventory workspace={this.props.workspace} />} />
							<Route path={ROUTES.character} render={() => <CharacterSheet workspace={this.props.workspace} />} />
							<Route path={ROUTES.meta} render={() => <Meta workspace={this.props.workspace} />} />

							<Route path={ROUTES.x} render={() => <XPage />} />

							<Route render={() => <p>Nothing here. <NavLink exact to={ROUTES.home}>Go back</NavLink></p>} />
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
