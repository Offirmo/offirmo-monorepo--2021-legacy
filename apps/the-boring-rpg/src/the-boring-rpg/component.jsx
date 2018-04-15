import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, NavLink } from 'react-router-dom'

import OhMyRpg from '../oh-my-rpg'

import './index.css';
import logo from './tbrpg_logo_512x98.png';

function UniverseAnchor({name, klass, level}) {
	return (
		<div className="o⋄flex-row">
			<span className="icomoon-user omr⋄status⁚avatar--icon" />
			<div className="omr⋄status⁚avatar--details o⋄flex-column">
				<span>{name}</span>
				<span>{klass} L.{level}</span>
			</div>
		</div>
	)
}

export default class TheBoringRPG extends Component {
	render() {
		return (
			<OhMyRpg

				logo={<img src={logo} height="100%" />}

				universeAnchor={
					<UniverseAnchor
						name={'Pertenax'}
						klass={'Paladin'}
						level={28}
					/>
				}
				hamburgerItems={[]}
				bottomMenuItems={[
					<span key="story" className="omr⋄bottom-menu⁚icon icomoon-treasure-map" />,
					<span key="character" className="omr⋄bottom-menu⁚icon icomoon-battle-gear" />,
					<span key="inventory" className="omr⋄bottom-menu⁚icon icomoon-locked-chest" />,
					<span key="chat" className="omr⋄bottom-menu⁚icon icomoon-conversation" />,
				]}
			>
				<div key="background-picture" className="omr⋄full-size-fixed-layer omr⋄bg⁚cover tbrpg⋄bg-image⁚fields_of_gold" />
			</OhMyRpg>
		);
	}
}
