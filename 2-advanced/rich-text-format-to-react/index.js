"use strict";

import React from 'react'
import classNames from 'classnames'

import { Enum, NodeType, walk, is_list, is_uuid_list, is_KVP_list } from '@offirmo/rich-text-format'
import '@offirmo/rich-text-format/src/renderers/style.css'

const LIB = 'rich_text_to_react'

export const NODE_TYPE_TO_COMPONENT = {
	[NodeType.heading]: 'h3',
	[NodeType.inline_fragment]: 'div',
	[NodeType.block_fragment]: 'div',
}

export const NODE_TYPE_TO_EXTRA_CLASSES = {
	[NodeType.inline_fragment]: [ 'o⋄rich-text⋄inline' ],
}


// turn the state into a react element
export function intermediate_on_node_exit({$node, $id, state}) {
	const { $type, $classes, $hints } = $node

	const result = {
		children: null,
		classes: [...$classes],
		component: NODE_TYPE_TO_COMPONENT[$type] || $type,
		wrapper: children => children
	}

	result.children =
		React.Children.map(
			state.children.map(c => c.element),
			(child, index) => {
				return (typeof child === 'string')
					? child
					: React.cloneElement(child, {key: `${index}`})
			}
		)

	result.classes.push(...(NODE_TYPE_TO_EXTRA_CLASSES[$type] || []))

	if (is_list($node)) {
		if (is_uuid_list($node)) {
			console.log(`${LIB} seen uuid list`)
			result.classes.push('o⋄rich-text⋄list--no-bullet')
		}

		switch($hints.bullets_style) {
			case 'none':
				result.classes.push('o⋄rich-text⋄list--no-bullet')
				break

			default:
				break
		}

		if (is_KVP_list($node)) {
			// TODO rewrite completely
			console.log(`${LIB} TODO KVP`)
			result.classes.push('o⋄rich-text⋄list--no-bullet')
		}
	}

	if ($hints.href)
		result.wrapper = children => React.createElement('a', {
			href: $hints.href,
			target: '_blank'
		}, children)

	if (!Enum.isType(NodeType, $type))
		result.wrapper = children => React.createElement('div', {
			className: 'o⋄rich-text⋄error',
		}, [ `TODO "${$type}"`, children])

	return result
}

export function intermediate_assemble({ children, classes, component, wrapper }) {
	if (component === 'br' || component === 'hr')
		children = undefined

	return wrapper(
		React.createElement(component, {
			className: classNames(...classes)
		}, children)
	)
}


// default
function on_node_exit(params) {
	const { children, classes, component, wrapper } = intermediate_on_node_exit(params)

	params.state.element = intermediate_assemble({ children, classes, component, wrapper })
	return params.state
}

function on_concatenate_str({state, str}) {
	state.children.push({
		element: str
	})
	return state
}

function on_concatenate_sub_node({$node, state, sub_state}) {
	state.sub_nodes.push($node)
	state.children.push(sub_state)
	return state
}

const callbacks = {
	on_node_enter: () => ({
		sub_nodes: [],
		element: null,
		children: [],
	}),
	on_node_exit,
	on_concatenate_str,
	on_concatenate_sub_node,
}

////////////
function TEST_overriden_on_node_exit(params) {
	const { children, classes, component, wrapper } = intermediate_on_node_exit(params)
	const { state, $node } = params
	const { $hints } = $node

	// XXX
	/*
	const class_names = classNames(...classes)
	if ($classes.includes('monster')) {
		children.push(<span className="monster-emoji">{$hints.possible_emoji}</span>)
	}*/


	let element = intermediate_assemble({ children, classes, component, wrapper })

	if ($hints.uuid) {
		//console.log(`${LIB} seen element with uuid:`, $node)
		element = React.createElement('button', {}, element)
	}

	state.element = element
	return state
}
////////////

export function to_react(doc, callback_overrides = {on_node_exit: TEST_overriden_on_node_exit}) {
	//console.log(`${LIB} Rendering a rich text:`, doc)
	const content = walk(doc, {
		...callbacks,
		...callback_overrides,
	}).element

	return React.createElement('div', {
		className: 'o⋄rich-text',
	}, content)
}

export default to_react
