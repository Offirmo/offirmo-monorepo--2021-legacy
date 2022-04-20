import assert from 'tiny-invariant'

export function hello(target: string = 'World'): void {
	assert(target !== 'happiness', 'Happiness forbidden ;)')
	console.log(`Hello, ${ target } :-(`)
}
