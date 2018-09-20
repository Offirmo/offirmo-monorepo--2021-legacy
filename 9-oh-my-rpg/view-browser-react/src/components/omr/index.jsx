import React, { Component } from 'react'

import ErrorBoundary from '@offirmo/react-error-boundary'
import SwipeableViews from 'react-swipeable-views'
import { virtualize, bindKeyboard } from 'react-swipeable-views-utils'
import { mod } from 'react-swipeable-views-core';

import { OhMyRPGUIContext } from '../state-context'
import './index.css';

const VirtualizeSwipeableViews = bindKeyboard(virtualize(SwipeableViews));

function HudTopLeft({isBurgerMenuOpen, openBurgerMenu, logo, toggleAbout, universeAnchor, }) {
	return (
		<div className="omr⋄hud⁚top-left">
			<div className="omr⋄hamburger" onClick={openBurgerMenu}>
				{isBurgerMenuOpen
					? <span className="icomoon-undo2"/>
					: <span className="icomoon-menu"/>
				}
			</div>

			{logo && <div className="omr⋄logo" onClick={toggleAbout}>
				<ErrorBoundary name={'omr:logo'}>
					{logo}
				</ErrorBoundary>
			</div>}

			{logo && universeAnchor && <div className="omr⋄universe-anchor">
				<ErrorBoundary name={'omr:universe-anchor'}>
					{universeAnchor}
				</ErrorBoundary>
			</div>}
		</div>
	)
}

function SwipableContent({isBurgerMenuOpen, screenIndex, screens, immersionSlidesRenderer, onScreenIndexChange}) {
	return (
		<VirtualizeSwipeableViews
			enableMouseEvents={true}
			index={screenIndex}
			onChangeIndex={onScreenIndexChange}
			style={{}}
			slideRenderer={immersionSlidesRenderer}
			slideCount={}
		/>
	)
}


function Main({children, logo, universeAnchor, bottomMenuItems, aboutContent}) {
	return (
		<OhMyRPGUIContext.Consumer>
			{({isBurgerMenuOpen, openBurgerMenu, isAboutOpen, toggleAbout, screenIndex}) => {
				document.documentElement.style.setProperty(
					'--omr⋄ui__bottom-menu--selected-reverse-index',
					-bottomMenuItems.length + screenIndex + 1
				)

				return (
					<div className="o⋄top-container">

						<div className="omr⋄hud⁚shifts-hider"/>

						<HudTopLeft
							{...{isBurgerMenuOpen, openBurgerMenu, logo, toggleAbout, universeAnchor}}
							/>

						<ErrorBoundary name={'omr:content'}>
							<SwipeableViews>
								{children}
							</SwipeableViews>
						</ErrorBoundary>

						{bottomMenuItems.length > 0 && <div className="omr⋄hud⁚bottom-right">
							<div className="omr⋄bottom-menu">
								<ErrorBoundary name={'omr:bottom-menu'}>
									{bottomMenuItems}
									<div className="omr⋄bottom-menu--selected-indicator"/>
								</ErrorBoundary>
							</div>
						</div>}

						{isAboutOpen && <div
							key="aboutBlanket"
							id="about-panel"
							className="o⋄top-container omr⋄content-area omr⋄plane⁚meta"
							onClick={toggleAbout}>
							<ErrorBoundary name={'omr:about-blanket'}>
								{aboutContent}
							</ErrorBoundary>
						</div>}

					</div>
				)
			}}
		</OhMyRPGUIContext.Consumer>
	)
}
Main.defaultProps = {
	logo: <span>[Game name/logo here]</span>,
	immersionSlides: [],
	bottomMenuItems: [],
	aboutContent: <span>This game was made by [x]...</span>,
	burgerPanelContent: <span>TODO put some settings here</span>
}

export default Main
