import React, {Component, Fragment} from 'react';

const { getRootSEC } = require('@offirmo/soft-execution-context')

import './index.css';

// TODO extract
export default class DevArea extends Component {

	constructor(props) {
		super(props);
		this.SEC = props.SEC || getRootSEC()
		const { CHANNEL, IS_DEV_MODE } = this.SEC.getInjectedDependencies()
		this.channel = props.channel || CHANNEL || 'dev'
		this.state = {
			displayed: !this.channel.startsWith('prod') || IS_DEV_MODE,
			open: false,
			paused: false,
		}
	}

	onToggle = () => {
		this.setState({
			open: !this.state.open,
		})
	}

	render() {
		const media_controls = []
		if (this.props.onPlayPause)
			media_controls.push(<button onClick={this.props.onPlayPause}>{this.state.paused ? '▶️' : '⏸️'}</button>)
		if (this.props.onFastForward)
			media_controls.push(<button onClick={this.props.onFastForward}>⏩</button>)
		if (this.props.onNext)
			media_controls.push(<button onClick={this.props.onNext}>⏭</button>)

		const dev_controls = [
			<tr key="refresh">
				<td className="DA-refresh">
					<button onClick={() => {window.location.reload()}}>🔄</button>
				</td>
			</tr>,
			<tr key="SE">
				<td>
					<button onClick={() => {
						const e = new Error('TEST ERROR synchronous!')
						throw e
					}}>🔥SE
					</button>
				</td>
			</tr>,
			<tr key="AE">
				<td>
					<button onClick={() => {
						setTimeout(() => {
							const e = new Error('TEST ERROR Asynchronous!')
							throw e
						}, 200)
					}}>🔥AE</button>
				</td>
			</tr>,
			<tr key="UP">
				<td>
					<button onClick={() => {
						setTimeout(() => { Promise.reject(new Error('TEST ERROR promise rejection!')) }, 200)
					}}>🔥UP</button>
				</td>
			</tr>,
		]
		if (media_controls.length > 0)
			dev_controls.unshift(
				<tr key="media">
					<td className="DA-controls">
						{media_controls}
					</td>
				</tr>
			)

		return (this.state.displayed &&
			<table className="dev-area">
				<tbody>
				<tr key="main">
					<td className="DA-environment"><button onClick={this.onToggle}>{this.channel}</button></td>
				</tr>
				{this.state.open && dev_controls}
				</tbody>
			</table>
		)
	}
}
