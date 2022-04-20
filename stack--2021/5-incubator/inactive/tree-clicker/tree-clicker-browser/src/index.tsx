import 'babel-polyfill'
import * as React from 'react'
import ReactDOM from 'react-dom'

//import './services/raven'
import './index.css'
import Root from './components/app-root'

const foo: string = 1

console.log('Hello from ts2!', foo)
ReactDOM.render(
	<Root />,
	document.getElementById('root'),
)
