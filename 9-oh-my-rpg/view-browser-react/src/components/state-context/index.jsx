import React from 'react'

const FLAGS_POSITION_TO_3RD_PARTY = {
	'top-center': 'tc',
	'bottom-center': 'bc',
}

const DEFAULT_FLAG_SETTINGS = {
	level: 'info',
	position: 'bottom-center',
	autoDismiss: 0,
}


const DEFAULT_STATE = {
	isBurgerMenuOpen: false,
	isAboutOpen: false,
	screenIndex: 0,
	isChatPanelVisible: false,
	popup: false, // TODO
	pendingFlags: [], // TODO
}

export const OhMyRPGUIContext = React.createContext({...DEFAULT_STATE})

export default class ContextProvider extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...DEFAULT_STATE
		}

		this.state._registerNotificationSystem = (notificationSystem) => {
			//console.log('_registerNotificationSystem', notificationSystem)
			if (!notificationSystem) return

			this._notificationSystem = notificationSystem

			const message = 'message'
			this.state.queueNotification({level: 'error', title: 'error', message})
			this.state.queueNotification({level: 'warning', title: 'warning', message})
			this.state.queueNotification({level: 'info', title: 'info', message})
			this.state.queueNotification({level: 'success', title: 'success', message})
		}

		this.state.queueNotification = (options = {}) => {
			let {level, title, message, position, autoDismiss} = {
				...DEFAULT_FLAG_SETTINGS,
				...options,
			}

			if (!title && !message)
				title = 'ERROR: no title nor message'

			position = FLAGS_POSITION_TO_3RD_PARTY[position] || position

			this._notificationSystem.addNotification({
				level, title, message, position, autoDismiss,
			})
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
			this.setState(state => ({
				isBurgerMenuOpen: state.isOpen,
			}))
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
		return (
			<OhMyRPGUIContext.Provider value={this.state}>
				{this.props.children}
			</OhMyRPGUIContext.Provider>
		)
	}
}
