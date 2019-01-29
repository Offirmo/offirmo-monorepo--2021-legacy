import React from 'react'
import 'babel-polyfill'
import ReactDOM from 'react-dom'
//import 'react-circular-progressbar/dist/styles.css'

import './services/raven'
import './index.css'
import Root from './components/root'


window.XOFF = {
	is_paused: true,
	debug_render: true,
}

ReactDOM.render(
	<Root />,
	document.getElementById('root'),
)
