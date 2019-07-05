import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Form, { FormHeader, FormSection, FormFooter } from '@atlaskit/form';

import { AppStateListenerAndProvider, AppStateConsumer } from '../context'
import { is_eligible, get_overrides_map, is_injection_requested } from '../context/state'
import GlobalSwitch from './global-switch'
import Overrides from './overrides'


export default class TabControl extends Component {
	static propTypes = {
	}

	render_view = ({app_state}) => {
		console.log(`🔄 TabControl render_view`, {app_state})

		if (!is_eligible(app_state)) {
			return (
				<Fragment>
					<p>This tab is not eligible.</p>
					<p>Only normal web pages can be manipulated.</p>
					<p>
						If you think this is a mistake,
						please <a href="https://github.com/Offirmo/offirmo-monorepo/issues" target="_blank">report here</a>.
					</p>
				</Fragment>
			)
		}

		const overrides = get_overrides_map(app_state)
		const overrides_count = Object.keys(overrides).length
		const show_overrides = is_injection_requested(app_state) && overrides_count > 0
			return (
			<Fragment>
				<GlobalSwitch />
				{show_overrides && <FormSection title="Overrides">
					<Overrides/>
				</FormSection>
				}
				<FormFooter>
					<button>Reload page</button>
				</FormFooter>
			</Fragment>
		)
	}

	render() {
		console.log(`🔄 TabControl render`)

		return (
			<AppStateListenerAndProvider>
				<Form onSubmit={data => console.log('submitted form data', data)}>
					{({ formProps }) => (
						<form {...formProps}>
							<FormHeader title="Universal Web Dev Tool" />
							<AppStateConsumer render={this.render_view} />
						</form>
					)}
				</Form>
			</AppStateListenerAndProvider>
		)
	}
}
