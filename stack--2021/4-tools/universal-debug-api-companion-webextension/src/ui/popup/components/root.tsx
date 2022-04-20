import assert from 'tiny-invariant'
import { browser } from 'webextension-polyfill-ts'
import { Component, Fragment, StrictMode } from 'react'
import PropTypes from 'prop-types'

import TabControl from '../../common/tab-control/components'
import { set_app_state } from '../../common/tab-control/context'
import { MSG_ENTRY } from '../../../common/consts'

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

let tab_id: number | undefined = undefined
if (browser.tabs) {
	const port_to_bg = browser.runtime.connect(undefined, {name: 'popup'})
	port_to_bg.onMessage.addListener((msg) => {
		console.group('📥 received a port message', msg)
		assert(msg[MSG_ENTRY], 'MSG_ENTRY')

		const payload = msg[MSG_ENTRY]
		const { type } = payload
		console.log({type, payload})

		// pure flux, we only ever expect one message type
		const { state } = msg[MSG_ENTRY]
		set_app_state(state)

		// snoop on the state to detect the activation of a new tab
		// without closing this one (happen when switching to a different window)
		const new_tab_id = state.tab.id
		if (tab_id && tab_id !== new_tab_id) {
			window.close()
		}
		else
			tab_id = new_tab_id
		console.groupEnd()
	})
	//port_to_bg.postMessage({hello: "test"});
}
