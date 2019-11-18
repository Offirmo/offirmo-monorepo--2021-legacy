const {
	promiseTry,
} = require('..')

promiseTry(() => { throw new Error('Oups!') })
	.then(
		() => console.log('OK (UNEXPECTED!)'),
		() => console.error('error! (expected)'),
	)
	.catch(console.error)
