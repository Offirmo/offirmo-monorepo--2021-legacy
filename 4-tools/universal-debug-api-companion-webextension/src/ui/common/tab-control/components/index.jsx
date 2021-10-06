import * as React from 'react'
import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Form, { FormSection, FormFooter } from '@atlaskit/form'

import './index.css'

import { AppStateListenerAndProvider, AppStateConsumer, get_origin, is_eligible, was_magic_installed } from '../context'
import GlobalSwitch from './global-switch'
import Overrides from './overrides'
import ReloadButton from './reload-button'

const LoadingVM = React.memo(
	function LoadingV() {
		return (
			<Fragment>
				<p>Loading...</p>
			</Fragment>
		)
	},
)

const NotEligibleVM = React.memo(
	function NotEligibleV() {
		return (
			<Fragment>
				<p>This tab is not eligible.</p>
				<p>Only normal, correctly loaded, non-local web pages can be manipulated.</p>
				<p className="o⋄colorꘌsecondary">
					If you think this is a mistake,
					please <a href="https://github.com/Offirmo/offirmo-monorepo/issues" target="_blank">report here</a>.
				</p>
			</Fragment>
		)
	},
)

const NotInstalledVM = React.memo(
	function NotInstalledV() {
		return (
			<Fragment>
				<p>The magic is not activated in this page!</p>
				<p>Maybe you just installed the extension? Or the page failed to load?</p>
				<p>Try to reload:</p>
				<ReloadButton />
				<p className="o⋄colorꘌsecondary">
					If you think this is a mistake,
					please <a href="https://github.com/Offirmo/offirmo-monorepo/issues" target="_blank">report here</a>.
				</p>
			</Fragment>
		)
	},
)

const ControlsVM = React.memo(
	function ControlsV() {
		return (
			<Form onSubmit={data => console.log('submitted form data', data)}>
				{({ formProps }) => (
					<form {...formProps}>
						<GlobalSwitch />
						<FormSection title="Overrides">
							<Overrides/>
						</FormSection>
						<FormFooter>
							<ReloadButton />
						</FormFooter>
					</form>
				)}
			</Form>
		)
	},
)

export default class TabControl extends Component {
	static propTypes = {
	}

	render_view = ({app_state}) => {
		//console.log(`🔄 TabControl render_view`, {app_state})

		const origin = get_origin(app_state)
		return (
			<div className="tab-controls o⋄fontꘌroboto">
				<h1><span className="o⋄character-as-icon">🛠</span> Universal Web Dev Tool</h1>
				{app_state.tab.id === -1
					? <LoadingVM />
					: !is_eligible(app_state)
						? <NotEligibleVM />
						: !was_magic_installed(app_state)
							? <NotInstalledVM/>
							: <ControlsVM />
				}
				<small className="o⋄colorꘌancillary tab-debug-info">Tab #{app_state.tab.id} {origin}</small>
			</div>
		)
	}

	render() {
		//if (window._debug_render) console.log(`🔄 TabControl render`)

		return (
			<AppStateListenerAndProvider>
				<AppStateConsumer render={this.render_view} />
			</AppStateListenerAndProvider>
		)
	}
}
