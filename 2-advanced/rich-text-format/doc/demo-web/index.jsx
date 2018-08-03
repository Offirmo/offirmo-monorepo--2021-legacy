"use strict";

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import Root from './components/root'

console.log('Starting index.jsx...')

ReactDOM.render(
	<Root />,
	document.getElementById('root'),
)
