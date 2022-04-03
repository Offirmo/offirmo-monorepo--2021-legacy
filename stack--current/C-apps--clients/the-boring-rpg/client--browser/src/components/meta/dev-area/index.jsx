import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { get_top_ish_window } from '@offirmo-private/xoff'
import { getRootSEC } from '@offirmo-private/soft-execution-context'
import { get_debug_snapshot } from '@offirmo-private/features-detection-browser'

import { BUILD_DATE } from '../../../build.json'
import './index.css'

export default class DevArea extends Component {
	static propTypes = {
		SEC: PropTypes.object,
		onPlayPause: PropTypes.func,
		onFastForward: PropTypes.func,
		onNext: PropTypes.func,
	}

	constructor(props) {
		super(props)

		this.SEC = props.SEC || getRootSEC()
		const { CHANNEL, IS_DEV_MODE, logger } = this.SEC.getInjectedDependencies()
		this.logger = logger
		this.channel = props.channel || CHANNEL
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

	onPlayPause = () => {
		if (!this.props.onPlayPause) return

		this.setState({ paused: !this.state.paused })
		this.props.onPlayPause(!this.state.paused)
	}

	onFastForward = () => {
		if (! this.props.onFastForward) return

		this.props.onFastForward()
	}

	onNext = () => {
		if (! this.props.onNext) return

		this.props.onNext()
	}

	render() {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 DevArea')

		const media_controls = []
		if (this.props.onPlayPause)
			media_controls.push(<button key="PlayPause" onClick={this.onPlayPause}>{this.state.paused ? '▶️' : '⏸️'}</button>)
		if (this.props.onFastForward)
			media_controls.push(<button key="FastForward" onClick={this.onFastForward}>⏩</button>)
		if (this.props.onNext)
			media_controls.push(<button key="Next" onClick={this.onNext}>⏭</button>)

		const dev_controls = [
			<tr key="refresh">
				<td className="DA-refresh">
					<button onClick={() => {get_top_ish_window().location.reload()}}>🔄</button>
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
			<tr key="INFO">
				<td>
					<button onClick={() => {
						console.info('❓INFO', { location, '@offirmo-private/features-detection-browser': get_debug_snapshot() })
					}}>❓INFO<br/><small>{BUILD_DATE}</small></button>
				</td>
			</tr>,
		]
		if (media_controls.length > 0)
			dev_controls.unshift(
				<tr key="media">
					<td className="DA-controls">
						{media_controls}
					</td>
				</tr>,
			)

		return (this.state.displayed &&
			<table className="dev-area">
				<tbody>
					<tr key="main">
						<td className="DA-environment"  onClick={this.onToggle}>{this.channel}</td>
					</tr>
					{this.state.open && dev_controls}
				</tbody>
			</table>
		)
	}
}
