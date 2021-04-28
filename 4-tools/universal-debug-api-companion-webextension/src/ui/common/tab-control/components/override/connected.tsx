import { Component } from 'react'
import PropTypes from 'prop-types'

import { OverrideState as OriginOverrideState } from '../../../../../common/state/origin'
import { SpecSyncStatus } from '../../../../../common/state/tab'
import { OverrideState as FullOverrideState } from '../../../../../common/state/ui'

import View from './view'

import {
	RenderParams,
	AppStateConsumer,
	get_global_switch_sync_status,
	get_override_sync_status,
	should_inject_the_lib,
} from '../../context'

////////////////////////////////////

export interface Props {
	override: Readonly<FullOverrideState>,
	on_change: (p: Partial<OriginOverrideState>) => void,
}

class Override extends Component<Props> {
	static propTypes = {
		override: PropTypes.object.isRequired,
		on_change: PropTypes.func.isRequired,
	}

	render_view = ({app_state}: RenderParams) => {
		const is_injection_enabled = should_inject_the_lib(app_state)
		const { override, on_change } = this.props
		const { key } = override.spec

		const status = (() => {
			const global_status = get_global_switch_sync_status(app_state)
			if (global_status === SpecSyncStatus.inactive)
				return global_status

			return get_override_sync_status(app_state, key)
		})()

		function on_override_change(p: Partial<OriginOverrideState>) {
			on_change({ ...p, key })
		}

		return (
			<View {...{is_injection_enabled, status, override, on_change: on_override_change}} />
		)
	}

	render() {
		return (
			<AppStateConsumer render={this.render_view} />
		)
	}
}

export default Override
