const {
	promiseTry,
} = require('..')

promiseTry(() => { throw new Error('Oups!') })
.then(
	() => console.log('OK (UNEXPECTED!)'),
	err => console.error('error! (expected)')
)
