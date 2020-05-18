import '@babel/core'

import * as React from "react"
import * as ReactDOM from "react-dom"
import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { overrideHook } from '@offirmo/universal-debug-api-browser'

//import './oh-my-rpg/landscape'

import './index.css'

/////////////////////////////////////////////////

setTimeout(() => ReactDOM.render(
	<ErrorBoundary name={'tbrpg_root'}>
		Hello world
	</ErrorBoundary>,
	document.getElementById('root'),
), 0)
