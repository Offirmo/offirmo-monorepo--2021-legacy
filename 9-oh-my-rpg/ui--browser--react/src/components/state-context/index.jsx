import * as React from 'react'

import ErrorBoundary from '@offirmo-private/react-error-boundary'

////////////

const FLAGS_POSITION_TO_3RD_PARTY = {
	'top-center': 'tc',
	'bottom-center': 'bc',
}
let flag_count = 0

const DEFAULT_FLAG_SETTINGS = {
	level: 'info',
	position: 'bottom-center',
	auto_dismiss_delay_ms: 0,
}

const DEFAULT_STATE = {
	isBurgerMenuOpen: false,
	isAboutOpen: false,
	screenIndex: 0,
	isChatPanelVisible: false,
	popup: false, // TODO
	pendingFlags: [], // TODO
}

const OhMyRPGUIContext = React.createContext({...DEFAULT_STATE})

class ContextProvider extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...DEFAULT_STATE,
		}

		this._notificationSystem = null
		this.notificationSystem = new Promise((resolve, reject) => {
			this.resolveNotificationSystem = resolve
			this.rejectNotificationSystem = reject
		})
		//this.notificationSystem.then(() => console.info('OMR notifications system ready ✅'))

		// TODO clean up in future iterations
		this.state._registerNotificationSystem = (notificationSystem) => {
			//console.log('_registerNotificationSystem', notificationSystem)

			if (this._notificationSystem) {
				// cleanups (should happen only in dev / HMR)
				this._notificationSystem.clearNotifications()
				this._notificationSystem = null
				this.rejectNotificationSystem(new Error('notif reloaded!'))

				this.notificationSystem = new Promise((resolve, reject) => {
					this.resolveNotificationSystem = resolve
					this.rejectNotificationSystem = reject
				})
				//this.notificationSystem.then(() => console.info('OMR notifications system ready ✅'))
			}

			if (!notificationSystem) return

			this._notificationSystem = notificationSystem
			// intentionally giving some room to let the app load
			setTimeout(() => {
				if (!this.resolveNotificationSystem) return

				this.resolveNotificationSystem(this._notificationSystem)
				this.resolveNotificationSystem = null
			}, 1000)
		}

		this.state.enqueueNotification = (options = {}) => {
			flag_count++
			//console.log(`OMR enqueueNotification #${flag_count}`, options)
			let {level, title, message, children, position, auto_dismiss_delay_ms, uid = flag_count} = {
				...DEFAULT_FLAG_SETTINGS,
				...options,
			}

			if (!title && !message && !children)
				title = 'OMR notification: ERROR: no title nor message nor children'

			// normalize content
			children = (
				<ErrorBoundary name={`omr:flag:${uid}`}>
					{title && <h4 className="notification-title">{title}</h4>}
					{message && <p className="notification-message">{message}</p>}
					{children}
				</ErrorBoundary>
			)

			position = FLAGS_POSITION_TO_3RD_PARTY[position] || position

			this.notificationSystem.then(notificationSystem =>
				notificationSystem.addNotification({
					uid,
					level,
					/*title, message,*/ children,
					position,
					autoDismiss: auto_dismiss_delay_ms / 1000.,
				}),
			)
		}

		this.state.openBurgerMenu = () => {
			//console.log('openBurgerMenu')
			this.setState(state => ({
				isBurgerMenuOpen: true,
				isAboutOpen: false,
			}))
		}

		// called by react-burger-menu
		this.state.onUpdateBurgerMenu = (state) => {
			//console.log('onUpdateBurgerMenu', state)
			// Note:
			// 1. state is not immutable (shame on react-burger-menu) that's why we copy the value ASAP (or bug)
			const new_value = state.isOpen
			// 2. when opening, it may be unneeded, causing an extra render
			if (new_value === this.state.isBurgerMenuOpen) return // not 100% orthodox but ok
			this.setState({
				isBurgerMenuOpen: new_value,
			})
		}

		this.state.toggleAbout = () => {
			this.setState(state => ({
				isAboutOpen: !state.isAboutOpen,
			}))
		}

		this.state.goToScreenIndex = this.state.onScreenIndexChange = (index) => {
			this.setState(state => ({
				screenIndex: index,
			}))
		}
	}

	render() {
		//console.log(`--- Provider ---`, JSON.parse(JSON.stringify(this.state)))
		return (
			<OhMyRPGUIContext.Provider value={this.state}>
				{this.props.children}
			</OhMyRPGUIContext.Provider>
		)
	}
}

export default ContextProvider

export {
	OhMyRPGUIContext,
}
