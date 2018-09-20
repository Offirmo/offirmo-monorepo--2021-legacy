// https://reacttraining.com/react-router/web/example/basic

import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

// auto-detect basename, correctly ignoring dynamic routes
const BASE_ROUTE = (pathname => {
	// stable point, everything after is likely to be a route
	const TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER = WI_BASE_PATH

	const splitted = pathname.split(TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER)
	const parent_segment = splitted[0]
	let base_route = parent_segment + TOP_SEGMENT_WE_ASSUME_WELL_BE_ALWAYS_SERVED_UNDER

	// special dev/staging case where we are served under an additional /dist
	if (splitted[1].startsWith('/dist'))
		base_route += '/dist'

	return base_route
})(window.location.pathname)

console.log({BASE_ROUTE})

const BasicExample = () => (
	<Router basename={BASE_ROUTE}>
		<div>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/about">About</Link>
				</li>
				<li>
					<Link to="/topics">Topics</Link>
				</li>
			</ul>

			<hr />

			<Route exact path="/" component={Home} />
			<Route path="/about" component={About} />
			<Route path="/topics" component={Topics} />
		</div>
	</Router>
)

const Home = () => (
	<div>
		<h2>Home</h2>
	</div>
)

const About = () => (
	<div>
		<h2>About</h2>
	</div>
)

const Topics = ({ match }) => (
	<div>
		<h2>Topics</h2>
		<ul>
			<li>
				<Link to={`${match.url}/rendering`}>Rendering with React</Link>
			</li>
			<li>
				<Link to={`${match.url}/components`}>Components</Link>
			</li>
			<li>
				<Link to={`${match.url}/props-v-state`}>Props v. State</Link>
			</li>
		</ul>

		<Route path={`${match.url}/:topicId`} component={Topic} />
		<Route
			exact
			path={match.url}
			render={() => <h3>Please select a topic.</h3>}
		/>
	</div>
)

const Topic = ({ match }) => (
	<div>
		<h3>{match.params.topicId}</h3>
	</div>
)

export default BasicExample

