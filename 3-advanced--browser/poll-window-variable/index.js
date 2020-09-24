import poll from '@offirmo-private/poll'

function pollWindowVariable(varname, options) {
	options = Object.assign({}, {debugId: `window.${varname}`}, options || {})
	return poll(() => window[varname], options)
}

export default pollWindowVariable
export { poll } // for convenience
