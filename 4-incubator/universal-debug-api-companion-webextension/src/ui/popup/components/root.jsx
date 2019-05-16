import React, { Component, Fragment, StrictMode } from 'react'
import PropTypes from 'prop-types'
import Form, { FormHeader, FormSection, FormFooter } from '@atlaskit/form';

import { AppStateListenerAndProvider } from '../context'
import GlobalSwitch from './global-switch'
import Overrides from './overrides'


//const StrictCheck = StrictMode
const StrictCheck = Fragment

export default class Root extends Component {
	static propTypes = {
	}

	render() {
		return (
			<StrictCheck>
				<AppStateListenerAndProvider>
					<Form onSubmit={data => console.log('form data', data)}>
						{({ formProps }) => (
							<form {...formProps}>
								<FormHeader title="Universal Web Dev Tool" />
								<GlobalSwitch />
								<FormSection title="Overrides">
									<Overrides />
								</FormSection>
								<FormFooter>
									TODO reload button
								</FormFooter>
							</form>
						)}
					</Form>
				</AppStateListenerAndProvider>
			</StrictCheck>
		)
	}
}
