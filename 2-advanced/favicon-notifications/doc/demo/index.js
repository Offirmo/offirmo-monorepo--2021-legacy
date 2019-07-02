'use strict'

import {
    set_number_in_favicon
} from '../..'

import './index.css'

console.log('Starting index.js...', set_number_in_favicon)

window.set_number_in_favicon = set_number_in_favicon

let x = 0.1
const intervalID = setInterval(() => {
    x = x * 1.5
    if (x > 10)
        x = 0.1
    set_number_in_favicon(x)
}, 1000)

window.x = () => clearInterval(intervalID)
