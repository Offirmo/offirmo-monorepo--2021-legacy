"use strict";

import React from 'react'
import ReactDOM from 'react-dom'
import 'normalize.css'

import { SEC, init_savegame} from './services/init'
import { App } from './components/app'

const workspace = {
	version: VERSION,
	verbose: true, // XXX
	state: null,
	SEC,
}
workspace.state = init_savegame(workspace)



ReactDOM.render(
	<App workspace={workspace}/>,
	document.getElementById('root')
)
