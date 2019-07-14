import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Form, { FormSection, FormFooter } from '@atlaskit/form';
import { browser } from "webextension-polyfill-ts"

import './index.css'

import { AppStateListenerAndProvider, AppStateConsumer, get_origin, is_eligible, get_overrides_map, is_injection_requested } from '../context'
import GlobalSwitch from './global-switch'
import Overrides from './overrides'


const LoadingVM = React.memo(
	function LoadingV() {
		return (
			<Fragment>
				<p>Loading...</p>
			</Fragment>
		)
	}
)

const NotEligibleVM = React.memo(
	function NotEligibleV() {
		return (
			<Fragment>
				<p>This tab is not eligible.</p>
				<p>Only normal web pages can be manipulated.</p>
				<p className="o⋄color⁚ancillary">
					If you think this is a mistake,
					please <a href="https://github.com/Offirmo/offirmo-monorepo/issues" target="_blank">report here</a>.
				</p>
			</Fragment>
		)
	}
)

const ControlsVM = React.memo(
	function ControlsV({show_overrides}) {
		return (
			<Form onSubmit={data => console.log('submitted form data', data)}>
				{({ formProps }) => (
					<form {...formProps}>
						<GlobalSwitch />
						{show_overrides && <FormSection title="Overrides">
							<Overrides/>
						</FormSection>
						}
						<FormFooter>
							{/* TODO better */}
							<button>Reload page</button>
						</FormFooter>
					</form>
				)}
			</Form>
		)
	}
)

export default class TabControl extends Component {
	static propTypes = {
	}

	render_view = ({app_state}) => {
		console.log(`🔄 TabControl render_view`, {app_state})

		const origin = get_origin(app_state)
		const overrides = get_overrides_map(app_state)
		const overrides_count = Object.keys(overrides).length
		const show_overrides = is_injection_requested(app_state) && overrides_count > 0
		return (
			<div className="tab-controls">
				<small className="o⋄color⁚ancillary">Tab #{app_state.tab.id} - {origin}</small>
				<h1>Universal Web Dev Tool</h1>
				{app_state.tab.id === -1
					? <LoadingVM />
					: !is_eligible(app_state)
						? <NotEligibleVM />
						: <ControlsVM show_overrides={show_overrides} />
				}
			</div>
		)
	}

	render() {
		console.log(`🔄 TabControl render`)

		return (
			<AppStateListenerAndProvider>
				<AppStateConsumer render={this.render_view} />
			</AppStateListenerAndProvider>
		)
	}
}
