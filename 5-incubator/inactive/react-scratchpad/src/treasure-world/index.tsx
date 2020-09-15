import '@babel/core'

import * as React from "react"
import * as ReactDOM from "react-dom"
import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo/universal-debug-api-browser'
import { asap_but_out_of_immediate_execution } from '@offirmo-private/async-utils'

//import './oh-my-rpg/landscape'

import './index.css'

/////////////////////////////////////////////////

asap_but_out_of_immediate_execution(() => ReactDOM.render(
	<ErrorBoundary name={'tbrpg_root'}>
		Hello world
	</ErrorBoundary>,
	document.getElementById('root'),
))
