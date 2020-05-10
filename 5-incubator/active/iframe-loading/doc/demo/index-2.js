/*
console.log(`[I2] js`, {
	'window.name': window.name,
	'window.opener': window.opener,
	'window.parent': window.parent,
})*/


window.oᐧloader.configure({
	bg_color: 'rgb(84, 61, 70)',
	fg_color: 'rgb(255, 235, 188)',
	legend: 'Treasure World Clicker',
})

setTimeout(() => {
	window.oᐧloader.on_rsrc_loaded('r1')
}, 1000)

setTimeout(() => {
	//console.info(`[I2] simulated load`)
	window.oᐧloader.on_rsrc_loaded()
}, 3000)

