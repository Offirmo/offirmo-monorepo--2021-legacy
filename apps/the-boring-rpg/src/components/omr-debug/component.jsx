import React, { Component } from 'react';

import ErrorBoundary from '@offirmo/react-error-boundary'

import './index.css';

export default class OMRDebug extends Component {

	constructor() {
		super();
		this.state = {
			isOpen: false,
		}

		this.toggle = () => {
			this.setState(state => ({
				isOpen: !state.isOpen,
			}))
		}
	}


	return (
		<div className="" >
	xxx
		</div>
	)
}
