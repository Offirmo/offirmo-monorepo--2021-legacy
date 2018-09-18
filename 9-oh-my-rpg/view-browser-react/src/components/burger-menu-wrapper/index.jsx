import React, { Component } from 'react'

import BurgerMenu from 'react-burger-menu/lib/menus/scaleDown'
import ErrorBoundary from '@offirmo/react-error-boundary'

import './index.css';

// technical elements needed by burger-menu scale down
// https://github.com/negomi/react-burger-menu#properties
const PAGE_WRAP_ID = 'oh-my-rpg-ui__page-wrap'
const OUTER_CONTAINER_ID = 'oh-my-rpg-ui__outer-container'


function BurgerMenuWrapper({isOpen, onStateChange, toggleBurgerMenu, mainContent, burgerPanelContent}) {
	const cloned_content = React.Children.map(mainContent, child => {
		return React.cloneElement(child, {
			toggleBurgerMenu,
		})
	})

	return (
		<div id={OUTER_CONTAINER_ID} className="o⋄top-container">

			<BurgerMenu
				isOpen={isOpen}
				pageWrapId={PAGE_WRAP_ID}
				outerContainerId={OUTER_CONTAINER_ID}
				onStateChange={onStateChange}
			>
				<ErrorBoundary name={'omr:burger-menu:menu'}>
					{burgerPanelContent}
				</ErrorBoundary>
			</BurgerMenu>

			<div id={PAGE_WRAP_ID} className="o⋄top-container">
				<ErrorBoundary name={'omr:burger-menu:main'}>
					{cloned_content}
				</ErrorBoundary>
			</div>
		</div>
	)
}

class WithState extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			isBurgerMenuOpen: false
		}

		// This keeps your state in sync with the opening/closing of the menu
		// via the default means, e.g. clicking the X, pressing the ESC key etc.
		this.handleStateChange = (state) => {
			this.setState({isBurgerMenuOpen: state.isOpen})
		}

		this.toggleMenu = () => {
			this.setState({isBurgerMenuOpen: !this.state.isBurgerMenuOpen})
		}
	}
	/*
       // This can be used to close the menu, e.g. when a user clicks a menu item
       closeMenu () {
           this.setState({isBurgerMenuOpen: false})
       }

       // This can be used to toggle the menu, e.g. when using a custom icon
       // Tip: You probably want to hide either/both default icons if using a custom icon
       // See https://github.com/negomi/react-burger-menu#custom-icons

   */
	render () {
		return (
			<BurgerMenuWrapper
				{...{
					...this.props,
					isOpen: this.state.isBurgerMenuOpen,
					onStateChange: this.handleStateChange,
					toggleBurgerMenu: this.toggleMenu,
				}}
			/>
		)
	}
}

export default WithState
