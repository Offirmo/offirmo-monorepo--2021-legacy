import React from 'react';

const DEFAULT = {
	isBurgerMenuOpen: false,
	isAboutOpen: false,
	screenIndex: 0,
	isChatPanelVisible: false,
	popup: false, // TODO
	messages: [], // TODO
}

export const OhMyRPGUIContext = React.createContext({...DEFAULT})

export default class ContextProvider extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			...DEFAULT
		}

		this.state.openBurgerMenu = () => {
			console.log('openBurgerMenu')
			this.setState(state => ({
				isBurgerMenuOpen: true,
				isAboutOpen: false,
			}))
		}

		// called by react-burger-menu
		this.state.onUpdateBurgerMenu = (state) => {
			console.log('onUpdateBurgerMenu', state)
			this.setState(state => ({
				isBurgerMenuOpen: state.isOpen,
			}))
		}

		this.state.toggleAbout = () => {
			this.setState(state => ({
				isAboutOpen: !state.isAboutOpen,
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
