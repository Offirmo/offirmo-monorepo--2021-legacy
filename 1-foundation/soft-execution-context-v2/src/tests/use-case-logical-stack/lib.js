import {
	get_root_SEC,
} from '../../index.js'

const LIB = 'FOO'

function get_lib_SEC(parent) {
	// TODO memoize
	return (parent || get_root_SEC())
		.create_child()
		.set_logical_stack({module: LIB})
}

function hello(target, {SEC} = {}) {
	get_lib_SEC(SEC).xTry(`hello`, ({logger, SEC}) => {
		console.log(`Hello, ${target}!`, SEC, SEC.get_stack_end())
	})
}


export {
	LIB,
	hello,
}
