import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'

import ErrorBoundary from '../..'


export default class Demo extends Component {

	render() {
		return (
			[
				<ErrorBoundary name={'demo1'}>
					Demo 1: no error
				</ErrorBoundary>,

				<ErrorBoundary name={'demo2'}
					render={() => { throw new Error('Demo 2 error!') }} />,

				<ErrorBoundary name={'demo3'}>
					{() => { throw new Error('Demo 3 error!') }}
				</ErrorBoundary>,

			]
		)
	}
}


const mountNode = document.getElementById('root')
ReactDOM.render(<Demo />, mountNode)
