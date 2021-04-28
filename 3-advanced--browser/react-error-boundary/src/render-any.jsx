import PropTypes from 'prop-types'
import assert from 'tiny-invariant'
import memoize_one from 'memoize-one'

// from React doc
// https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'ComponentX'
}


// inspired from render-props:
// https://github.com/donavon/render-props/blob/develop/src/index.js
// but enhanced.
const id = 0
function render_any(xprops) {
	const { children, render, ...props } = xprops
	const id = props.key || props.name || 'ra#{id++}'

	//console.log(`render_any "${id}"`, { children, render, props })

	const ComponentOrFunctionOrAny = children || render || (
		<span className={`o⋄error-report error-boundary-report--${id}`}>
			ErrorBoundary: no children nor render prop!
		</span>
	)
	assert(children || render, `render_any "${id}": no children nor render prop!`)
	assert(!(children && render), `render_any "${id}": competing children and render prop!`)

	const isComponent = ComponentOrFunctionOrAny.render || (ComponentOrFunctionOrAny.prototype && ComponentOrFunctionOrAny.prototype.render)
	if (isComponent) {
		//console.warn('render_any: component', getDisplayName(ComponentOrFunctionOrAny), id)
		return <ComponentOrFunctionOrAny {...props} />
	}

	if (typeof ComponentOrFunctionOrAny === 'function')
		return ComponentOrFunctionOrAny({
			...(ComponentOrFunctionOrAny.defaultProps || {}),
			...props,
		})

	//console.warn(`render_any "${id}": defaulting to "${ComponentOrFunctionOrAny}"`, ComponentOrFunctionOrAny)
	return ComponentOrFunctionOrAny
}

const render_any_m = memoize_one(render_any)

export {
	render_any,
	render_any_m,
}
