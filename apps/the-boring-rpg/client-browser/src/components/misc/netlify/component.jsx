import { Enum } from 'typescript-string-enums'
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types'

import poll_window_variable, { poll } from '@offirmo/poll-window-variable'

import get_game_instance from '../../../services/game-instance-browser'

import './index.css';

const STATES = Enum(
	'WAITING_FOR_LIB',
	'NOT_LOGGED_IN',
	'LOGGED_IN',
	'ERROR',
)

class NetlifyLoggedIndicator extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
		on_logged_in: PropTypes.func.isRequired,
		on_request_logout: PropTypes.func.isRequired,
	}

	state = {
		loaded: false,
	}

	getName = () => {
		const { user } = this.props

		if (user.user_metadata && user.user_metadata.full_name)
			return user.user_metadata.full_name

		return user.email
	}

	constructor(props) {
		super(props)

		const { user } = this.props
		const avatar_name = get_game_instance().queries.get_sub_state('avatar').name

		// user may not be fully populated immediately
		// we need to refresh when it is
		poll(() => !!user.user_metadata, { timeoutMs: 30 * 1000 })
			.then(() => {
				//console.log('got metadata...')
				this.setState({
					loaded: true,
				})

				const { user, on_logged_in } = this.props
				on_logged_in(user)
			})
	}

	render() {
		const { on_request_logout } = this.props
		// we could display a loader, but not worth it.
		return (
			<div className="netlify-widget">
				Logged in as: {this.getName() || '(pending…)'}
				<button onClick={on_request_logout}>log out</button>
			</div>
		)
	}
}

export default class NetlifyIdentity extends Component {
	static propTypes = {
		on_logged_in: PropTypes.func.isRequired,
		request_redirect: PropTypes.func.isRequired,
	}

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

				// note: called only on FRESH login
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

				NetlifyIdentity.on('error', err => {
					console.error('<NetlifyIdentity /> error', err)
					throw err // to be caught by Sentry
				});

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
							this.setState({
								state: STATES.LOGGED_IN,
								user,
							})
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
			.catch(err => {
				// TODO report error
				this.setState({
					state: STATES.ERROR,
				})
			})
	}

	on_click_on_signin_button = () => {
		this.props.request_redirect(window.location.href)
		this.NetlifyIdentity.open()
	}

	on_request_logout = () => {
		this.NetlifyIdentity.logout()
	}

	render() {
		if (window.XOFF.flags.debug_render) console.log('🔄 NetlifyIdentity')

		const { on_logged_in } = this.props

		switch (this.state.state) {
			case STATES.ERROR:
				return <div>(login error. Disable ad blocker?)</div>
			case STATES.WAITING_FOR_LIB:
				return <div className='blinking'>...</div>
			case STATES.NOT_LOGGED_IN:
				return <button onClick={this.on_click_on_signin_button}>Sign in / sign up...</button>
			case STATES.LOGGED_IN:
				return <NetlifyLoggedIndicator
					user={this.state.user}
					on_logged_in={on_logged_in}
					on_request_logout={this.on_request_logout}
				/>
		}
	}
}
