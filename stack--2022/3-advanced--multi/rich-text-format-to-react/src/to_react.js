import memoize_one from 'memoize-one'
import * as React from 'react'
import classNames from 'classnames'

import { Enum, NodeType, walk, is_list, is_uuid_list, is_KVP_list } from '@offirmo-private/rich-text-format'
import '@offirmo-private/rich-text-format/src/renderers/style.css'

const LIB = 'rich_text_to_react'

export const NODE_TYPE_TO_COMPONENT = {
	// will default to own tag if not in this list (ex. strong => strong)
	[NodeType.weak]: 'span',
	[NodeType.heading]: 'h3',
	[NodeType.inline_fragment]: 'span',
	[NodeType.block_fragment]: 'div',
}

export const NODE_TYPE_TO_EXTRA_CLASSES = {
	[NodeType.weak]: [ 'o⋄colorꘌsecondary' ],
}

const warn_kvp = memoize_one(() => console.warn(`${LIB} TODO KVP`))

// a clever key is critically needed in general, but even more critical
// for lists, whom default keys "1, 2, 3" is dangerous if the list is re-ordered.
// Thus we attempt to enrich the default key ($id) from various hints.
export function generate_react_key({$id, $node}) {
	let key = $id

	if ($node.$type === 'li') {
		// this is a wrapper, go down a level
		$node = $node.$sub.content
	}

	if ($node.$hints) {
		if ($node.$hints.key)
			key += `.aka:${$node.$hints.key}`
		if ($node.$hints.uuid)
			key += `.uuid:${$node.$hints.uuid}`
	}

	//console.log('generate_react_key', {$id, $node, key})

	return key
}

// turn the state into a react element
export function intermediate_on_node_exit({$node, $id, state}, options) {
	const { $type, $classes, $hints } = $node

	// initial values, may be overriden later
	const result = {
		children: null,
		classes: [...$classes],
		component: NODE_TYPE_TO_COMPONENT[$type] || $type,
		wrapper: children => children,
	}

	result.children = state.children.map(c => c.element)
	if (result.children.length > 1) {
		// at their level, children can't ensure that their keys are unique,
		// especially for {br} which may be repeated.
		// We need to help with that:

		//console.group(`starting rekey for ${$id}...`)
		//console.log({$node, state})
		const key_count = {}
		result.children = result.children.map(child => {
			if (typeof child === 'string')
				return child

			let key = child.key

			key_count[key] = key_count[key]
				? key_count[key] + 1
				: 1

			if (key_count[key] > 1)
				key += `+${key_count[key]}`

			if (key !== child.key)
				child = React.cloneElement(child, { key })

			return child
		})
		//console.log(key_count)
		//console.groupEnd()
	}

	result.classes.push(...(NODE_TYPE_TO_EXTRA_CLASSES[$type] || []), 'o⋄children-spacing⁚flow')

	if (is_list($node)) {
		result.classes.push('o⋄rich-text⋄list')

		if (is_uuid_list($node)) {
			//console.log(`${LIB} seen uuid list`)
			result.classes.push('o⋄rich-text⋄list--interactive')
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
			warn_kvp()
			result.classes.push('o⋄rich-text⋄list--no-bullet')
		}
	}

	if ($hints.href)
		result.wrapper = children => React.createElement(
			'a',
			{
				key: generate_react_key({$id, $node}),
				href: $hints.href,
				target: '_blank',
			},
			children,
		)
	else if (!Enum.isType(NodeType, $type)) {
		console.error(`Unknown node type "${$type}"!`)
		// TODO throw instead??
		result.wrapper = children => React.createElement(
			'div',
			{
				key: generate_react_key({$id, $node}),
				className: 'o⋄rich-text⋄error',
			},
			[
				`[Unknown type "${$type}"]`, // extra inline text
				children,
			],
		)
	}

	return result
}

export function intermediate_assemble({ $id, $node, children, classes, component, wrapper }, options) {
	//console.log('intermediate_assemble', arguments)
	if (component === 'br' || component === 'hr')
		children = undefined

	return wrapper(
		React.createElement(
			component,
			{
				key: generate_react_key({$id, $node}),
				...(classes.length && { className: classNames(...classes)}),
			},
			children,
		),
	)
}


/// XXX ////
// default version,
// replace it for extension
function on_node_exit(params, options) {
	const { children, classes, component, wrapper } = intermediate_on_node_exit(params, options)

	params.state.element = intermediate_assemble({ ...params, children, classes, component, wrapper }, options)

	return params.state
}
/// XXX ////

function on_concatenate_str({state, str}) {
	state.children.push({
		element: str,
	})
	return state
}

function on_concatenate_sub_node({$node, state, sub_state}, options) {
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
	on_filter_Capitalize: ({state}) => {
		//console.warn('rich-text-to-react Capitalize', state)

		state.element = React.cloneElement(
			state.element,
			{
				children: React.Children.map(
					state.element.props.children,
					(child) => (typeof child === 'string')
						? child[0].toUpperCase() + child.slice(1)
						: child,
				),
			},
		)

		return state
	},
}


////////////

export function to_react(doc, callback_overrides = {}, options = {}) {
	//console.log(`${LIB} Rendering a rich text:`, doc)
	const content = walk(
		doc,
		{
			...callbacks,
			...callback_overrides,
		},
		options,
	).element

	return React.createElement('div', {
		key: options.key || 'rich-text-format-to-react--root',
		className: 'o⋄rich-text o⋄children-spacing⁚flow',
	}, content)
}

export default to_react
