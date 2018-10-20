import React, { Component, Fragment } from 'react';
import poll_window_variable from '@offirmo/poll-window-variable'

//import './index.css';

const STATES = {
	WAITING_FOR_LIB: 'WAITING_FOR_LIB',
	NOT_LOGGED_IN: 'NOT_LOGGED_IN',
	LOGGED_IN: 'LOGGED_IN',
}

export default class NetlifyIdentity extends Component {
	state = {
		state: STATES.WAITING_FOR_LIB,
		user: null,
	}

	componentDidMount() {
		poll_window_variable('netlifyIdentity', { timeoutMs: 30 * 1000 })
			.then(NetlifyIdentity => {
				console.info('Netlify Identity loaded ✅')

				NetlifyIdentity.on('init', user => console.info('netlify init', user));
				NetlifyIdentity.on('login', user => console.info('netlify login', user));
				NetlifyIdentity.on('logout', () => console.info('netlify Logged out'));
				NetlifyIdentity.on('error', err => console.error('netlify error', err));
				NetlifyIdentity.on('open', () => console.info('netlify Widget opened'));
				NetlifyIdentity.on('close', () => console.info('netlify Widget closed'));

				this.NetlifyIdentity = NetlifyIdentity
			})
			.then(() => {
				const user = this.NetlifyIdentity.currentUser()
				this.setState({
					state: user ? STATES.LOGGED_IN : STATES.NOT_LOGGED_IN,
					user,
				})

				if (user) {
					console.log({user})
					// refresh token, https://github.com/netlify/netlify-identity-widget/issues/108
					user.jwt()
						.then(() => {
							// TODO
						})
				}
			})
	}

	onSignInUpButton = () => {
		// TODO prepare redirect
		this.NetlifyIdentity.open()
	}

	render() {
		switch (this.state.state) {
			case STATES.WAITING_FOR_LIB:
				return <div>...</div>
			case STATES.NOT_LOGGED_IN:
				return <button onClick={this.onSignInUpButton}>Sign in / sign up...</button>
			case STATES.LOGGED_IN:
				return <div>TODO user</div>
		}
	}
}
