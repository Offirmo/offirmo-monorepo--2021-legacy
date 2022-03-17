"use strict";

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import 'react-circular-progressbar/dist/styles.css'

import Root from './components/app-root'


ReactDOM.render(
	<Root />,
	document.getElementById('root'),
)
