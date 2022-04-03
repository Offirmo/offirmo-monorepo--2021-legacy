
console.log(`[I2] js`, {
	location,
	'window.name': window.name,
	'window.opener': window.opener,
	'window.parent': window.parent,
	'document.referrer': document.referrer,
})

if (!window.oᐧloader) {
	const { searchParams } = new URL(window.location.href)
	const has_parent = window.parent !== window
	const hint_at_loader = searchParams.has('oᐧloader')
	if (!has_parent || !hint_at_loader)
		console.warn(`[I2] can't find the loader!`, { has_parent, hint_at_loader })

	window.oᐧloader = {
		configure(...args) {
			window.parent.postMessage(
				{ oᐧloader: { method: 'configure', args}},
				'*'
			)
		},
		on_rsrc_loaded(...args) {
			window.parent.postMessage(
				{ oᐧloader: { method: 'on_rsrc_loaded', args}},
				'*'
			)
		},
	}
}

window.oᐧloader.configure({
	bg_color: 'rgb(84, 61, 70)',
	fg_color: 'rgb(255, 235, 188)',
	legend: 'Treasure World Clicker',
	bg_picture: [
		window.getComputedStyle(document.querySelector('html')).backgroundImage,
		'38%', '99%',
	],
})
setTimeout(() => {
	console.info(`[I2] simulated load 1/2`)
	window.oᐧloader.on_rsrc_loaded('r1')
}, 1000)

setTimeout(() => {
	console.info(`[I2] simulated load 2/2`)
	window.oᐧloader.on_rsrc_loaded()
}, 3000)
