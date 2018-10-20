import React, { Component, Fragment } from 'react';
import poll_window_variable, { poll } from '@offirmo/poll-window-variable'

//import './index.css';

const STATES = {
	WAITING_FOR_LIB: 'WAITING_FOR_LIB',
	NOT_LOGGED_IN: 'NOT_LOGGED_IN',
	LOGGED_IN: 'LOGGED_IN',
	//ERROR: 'ERROR',
}


const REDIRECT_LS_KEY = 'OA.pending_redirect'
function request_redirect(url) {
	const redirect_request = {
		url,
		timestamp_ms: Date.now(),
	}

	localStorage.setItem(REDIRECT_LS_KEY, JSON.stringify(redirect_request))
}

class LoggedIn extends Component {
	state = {
		loaded: false,
	}

	constructor(props) {
		super(props)

		if (!this.props.user)
			throw new Error('LoggedIn: need a user!')

		// user may not be fully populated immediately
		// we need to refresh when it is
		poll(() => !!this.props.user.user_metadata, { timeoutMs: 30 * 1000 })
			.then(() => {
				//console.log('got metadata...')
				this.setState({
					loaded: true,
				})
			})
	}

	render() {
		const { user, onRequestLogout } = this.props
		return (
			<Fragment>
				Logged in as: {user.user_metadata ? user.user_metadata.full_name : '(pending…)'}
				<button onClick={onRequestLogout}>log out</button>
			</Fragment>
		)
	}
}



export default class NetlifyIdentity extends Component {
	state = {
		state: STATES.WAITING_FOR_LIB,
		user: null,
		widget_open: false,
	}

	componentDidMount() {
		poll_window_variable('netlifyIdentity', { timeoutMs: 2 * 60 * 1000 })
			.then(NetlifyIdentity => {
				console.info('<NetlifyIdentity /> Identity loaded ✅')

				NetlifyIdentity.on('init', user => console.info('<NetlifyIdentity /> init', user));

				NetlifyIdentity.on('login', user => {
					console.info('<NetlifyIdentity /> login', user)
					this.setState({
						state: STATES.LOGGED_IN,
						user,
					})
				});

				NetlifyIdentity.on('logout', () => {
					console.info('<NetlifyIdentity /> Logged out')
					this.setState({
						state: STATES.NOT_LOGGED_IN,
						user: null,
					})
				})

				NetlifyIdentity.on('error', err => console.error('<NetlifyIdentity /> error', err));

				NetlifyIdentity.on('open', () => {
					console.info('<NetlifyIdentity /> Widget opened')
					this.setState({ widget_open: true })
				})

				NetlifyIdentity.on('close', () => {
					console.info('<NetlifyIdentity /> Widget closed')
					this.setState({ widget_open: false })
				})

				this.NetlifyIdentity = NetlifyIdentity
			})
			.then(() => {
				const user = this.NetlifyIdentity.currentUser()

				if (!user) {
					this.setState({ state: STATES.NOT_LOGGED_IN })
				}
				else {
					//console.log({user})
					// refresh token, https://github.com/netlify/netlify-identity-widget/issues/108
					user.jwt()
						.then(() => {
							console.log('<NetlifyIdentity /> user refreshed', user)
						})
						/* not handled for now, we'll see in Sentry if that happens
						.catch(err => {
							console.error('<NetlifyIdentity /> on trying to refresh Netlify token:', err)
							// clean up
							this.NetlifyIdentity.logout()
							this.setState({ state: STATES.NOT_LOGGED_IN }) // should not be needed, but just in case...
						})*/
				}
			})
	}

	onClickOnSignInUpButton = () => {
		request_redirect(window.location.href)
		this.NetlifyIdentity.open()
	}

	onRequestLogout = () => {
		this.NetlifyIdentity.logout()
	}

	render() {
		console.log('<NetlifyIdentity /> Render')

		switch (this.state.state) {
			case STATES.WAITING_FOR_LIB:
				return <div>...</div>
			case STATES.NOT_LOGGED_IN:
				return <button onClick={this.onClickOnSignInUpButton}>Sign in / sign up...</button>
			case STATES.LOGGED_IN:
				return <LoggedIn user={this.state.user} onRequestLogout={this.onRequestLogout}/>
		}
	}
}
