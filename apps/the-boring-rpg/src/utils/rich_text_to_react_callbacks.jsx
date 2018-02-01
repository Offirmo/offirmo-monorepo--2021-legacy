import React from 'react'
import classNames from 'classnames'

import { TBRPGElement } from '../components/atoms/elements'

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
	const { $type, $classes, $hints } = $node

	let children = state.children.map(c => c.element)
	children = React.Children.map(children, (child, index) => {
		return (typeof child === 'string')
			? child
			: React.cloneElement(child, {key: `${index}`})
	})

	let element = null
	const class_names = classNames(...$classes)
	switch ($type) {
		case 'span': element = <span className={class_names}>{children}</span>; break

		case 'br': element = <br className={class_names}/>; break
		case 'hr': element = <hr className={class_names}/>; break

		case 'li': element = <li className={class_names}>{children}</li>; break
		case 'ol': element = <ol className={class_names}>{children}</ol>; break
		case 'ul': element = <ul className={class_names}>{children}</ul>; break

		case 'strong': element = <strong className={class_names}>{children}</strong>; break
		case 'em': element = <em className={class_names}>{children}</em>; break
		case 'section': element = <span className={class_names}>{children}</span>; break
		case 'heading': element = <h3 className={class_names}>{children}</h3>; break

		default:
			element = <span className={class_names}>TODO "{$type}" {children}</span>
			break
	}

	if ($hints.uuid) {
		console.log('seen element with uuid:', $node)
		element = <TBRPGElement uuid={$hints.uuid}>{element}</TBRPGElement>
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
