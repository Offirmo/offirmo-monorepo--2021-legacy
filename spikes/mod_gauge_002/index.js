#!/usr/bin/env node
'use strict';

const Gauge = require('gauge')

console.log('\n-------')

const gauge = new Gauge()

let COMPLETED = 20.
let counter = 0
function step() {
	counter++
	gauge.show('working…', counter / COMPLETED)

	if (counter < COMPLETED)
		setTimeout(step, 100)
}

step()

//gauge.hide()
