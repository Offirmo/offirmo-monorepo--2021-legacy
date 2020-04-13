/*
console.log(`[I2] js`, {
	'window.name': window.name,
	'window.opener': window.opener,
	'window.parent': window.parent,
})*/

window.parent.configure_loader({
	bg_color: 'rgb(84, 61, 70)',
	fg_color: 'rgb(255, 235, 188)',
	legend: 'Treasure World Clicker',
})

setTimeout(() => {
	window.parent.on_rsrc_loaded('r1')
}, 1000)

/*setTimeout(() => {
	//console.info(`[I2] simulated load`)
	window.parent.on_rsrc_loaded()
}, 5000)
*/
