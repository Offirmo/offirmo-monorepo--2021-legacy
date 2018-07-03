import React, {Component, Fragment} from 'react';

import './index.css';


export default class DevArea extends Component {
	state = {
		open: false,
		paused: false,
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
			<tr>
				<td className="DA-refresh">
					<button onClick={() => {window.location.reload()}}>🔄</button>
				</td>
			</tr>,
			<tr>
				<td>
					<button onClick={() => {
						throw new Error('TEST ERROR synchronous!')
					}}>🔥SE
					</button>
				</td>
			</tr>,
			<tr>
				<td>
					<button onClick={() => {
						setTimeout(() => { throw new Error('TEST ERROR Asynchronous!') }, 200)
					}}>🔥AE</button>
				</td>
			</tr>,
			<tr>
				<td>
					<button onClick={() => {
						setTimeout(() => { Promise.reject(new Error('TEST ERROR promise rejection!')) }, 200)
					}}>🔥UP</button>
				</td>
			</tr>,
		]
		if (media_controls.length > 0)
			dev_controls.unshift(<tr>
				<td className="DA-controls">
					{media_controls}
				</td>
			</tr>)

		return (
			<table className="dev-area">
				<tbody>
				<tr>
					<td className="DA-environment"><button onClick={this.onToggle}>Staging</button></td>
				</tr>
				{this.state.open && dev_controls}
				</tbody>
			</table>
		)
	}
}
