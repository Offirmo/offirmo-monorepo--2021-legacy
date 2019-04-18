import React from 'react'

import 'babel-polyfill'
import ReactDOM from 'react-dom'
//import 'react-circular-progressbar/dist/styles.css'

import './services/raven'
import './index.css'
import Root from './components/root'

// https://www.npmjs.com/package/why-did-you-update
if (process.env.NODE_ENV !== 'production') {
	const { whyDidYouUpdate } = require('why-did-you-update')
	whyDidYouUpdate(React)
}

window.XOFF = {
	flags: {
		is_paused: false,
		debug_render: false,
	}
}

ReactDOM.render(
	<Root />,
	document.getElementById('root'),
)
