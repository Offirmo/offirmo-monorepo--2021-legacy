import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

//import './services/raven'
import './index.css'
//import Root from './components/root'

const foo: string = 1

console.log('Hello from ts2!', foo)
ReactDOM.render(
	<p>
		Hello
	</p>,
	document.getElementById('root'),
)
