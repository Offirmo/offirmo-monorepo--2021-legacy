import React from 'react'
import classNames from 'classnames'

const LIB = 'rich_text_to_react'

function createNodeState() {
	return {
		element: null,
		children: [],
	}
}

function on_root_exit({state}) {
	return state.element
}


// turn the state into a react element
function on_node_exit({$node, $id, state, depth}) {
	const { $type, $classes } = $node

	const classes = classNames(...$classes)
	let children = state.children.map(c => c.element)
	children = React.Children.map(children, (child, index) => {
		return (typeof child === 'string')
			? child
			: React.cloneElement(child, {key: `${index}`})
	})
	let element = null

	switch ($type) {
		case 'span': element = <span className={classes}>{children}</span>; break

		case 'br': element = <br className={classes}/>; break
		case 'hr': element = <hr className={classes}/>; break

		case 'li': element = <li className={classes}>{children}</li>; break
		case 'ol': element = <ol className={classes}>{children}</ol>; break
		case 'ul': element = <ul className={classes}>{children}</ul>; break

		case 'strong': element = <strong className={classes}>{children}</strong>; break
		case 'em': element = <em className={classes}>{children}</em>; break
		case 'section': element = <section className={classes}>{children}</section>; break
		case 'heading': element = <h1 className={classes}>{children}</h1>; break

		default:
			element = <span className={classes}>TODO "{$type}" {children}</span>
			break
	}

	state.element = element
	return state
}

function on_type({$type, state, $node, depth}) {
	return state
}

function on_concatenate_str({state, str}) {
	state.children.push({
		element: str
	})
	return state
}

function on_concatenate_sub_node({state, sub_state}) {
	state.children.push(sub_state)
	return state
}


const callbacks = {
	on_root_exit,
	on_node_enter: createNodeState,
	on_node_exit,
	on_concatenate_str,
	on_concatenate_sub_node,
	//on_type,
}

module.exports = callbacks
