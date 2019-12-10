#!/usr/bin/env node
'use strict';

const Gauge = require('gauge')

console.log('\n-------')

const gauge = new Gauge()

gauge.show('working…', 0)
setTimeout(() => gauge.show('working…', 0.25), 500)
setTimeout(() => gauge.show('working…', 0.50), 1000)
setTimeout(() => gauge.show('working…', 0.75), 1500)
setTimeout(() => gauge.show('working…', 0.99), 2000)
setTimeout(() => gauge.hide(), 2300)

console.log('\n-------')


/*
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
*/
