import { browser } from "webextension-polyfill-ts"
import React, { Component, Fragment, StrictMode } from 'react'
import PropTypes from 'prop-types'

import TabControl from '../../common/tab-control/components'
import { set_app_state } from '../../common/tab-control/context'

////////////////////////////////////

//const StrictCheck = StrictMode
const StrictCheck = Fragment

export default class Root extends Component {
	static propTypes = {
	}

	render() {
		return (
			<StrictCheck>
				<TabControl />
			</StrictCheck>
		)
	}
}
//<TabControl />

////////////////////////////////////

if (browser.tabs) {
	const port_to_bg = browser.runtime.connect({name: "popup"});
	port_to_bg.onMessage.addListener((msg) => {
		console.group(`received a port message`, msg)
		assert(msg[MSG_ENTRY], 'MSG_ENTRY')

		set_app_state(msg[MSG_ENTRY].state)
		console.groupEnd()
	});
	//port_to_bg.postMessage({hello: "test"});
}
