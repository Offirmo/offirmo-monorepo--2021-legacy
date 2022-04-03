import { browser } from 'webextension-polyfill-ts'
import { Component } from 'react'
import PropTypes from 'prop-types'

import send_message from '../../../utils/send-message'
import View from './view'

import {
	RenderParams,
	AppStateConsumer,
	get_origin,
	should_inject_the_lib,
	get_global_switch_sync_status,
} from '../../context'
import { create_msg_toggle_lib_injection } from '../../../../../common/messages'


class GlobalSwitch extends Component {
	static propTypes = {
	}

	on_change = () => {
		console.log('👆 GlobalSwitch on_change')
		send_message(create_msg_toggle_lib_injection())
	}

	render_view = ({app_state}: RenderParams) => {
		//console.log(`🔄 GlobalSwitch render_view`, {app_state})
		return (
			<View
				origin={get_origin(app_state)}
				is_injection_requested={should_inject_the_lib(app_state)}
				status={get_global_switch_sync_status(app_state)}
				on_change={this.on_change}
			/>
		)
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}

export default GlobalSwitch
