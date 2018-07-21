"use strict";

import React from 'react'
import classNames from 'classnames'

const { walk, is_list } = require('../../../dist/src.es7.cjs')

const LIB = 'rich_text_to_react'


// turn the state into a react element
function on_node_exit({$node, $id, state, depth}) {
	const { $type, $classes, $hints } = $node

	let children = state.children.map(c => c.element)
	children = React.Children.map(children, (child, index) => {
		return (typeof child === 'string')
			? child
			: React.cloneElement(child, {key: `${index}`})
	})

	const classes = [...$classes]

	if (is_list($node)) {
		switch($hints.bullets_style) {
			case 'none':
				classes.push('o⋄rich-text⋄ul--no-bullet')
				break

			default:
				break
		}
	}

	if($type === 'inline_fragment')
		classes.push('o⋄rich-text⋄inline')

	const class_names = classNames(...classes)
	if ($classes.includes('monster')) {
		children.push(<span className="monster-emoji">{$hints.possible_emoji}</span>)
	}

	let element = null
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

		case 'inline_fragment':
			/* fallthrough */
		case 'block_fragment':
			element = <div className={class_names}>{children}</div>; break

		default:
			element = <div className={class_names}>TODO "{$type}" {children}</div>
			break
	}

	if ($hints.uuid) {
		console.log('seen element with uuid:', $node)
		// TODO extensible
		//element = <TBRPGElement uuid={$hints.uuid}>{element}</TBRPGElement>
	}

	if ($hints.href) {
		element = <a href={$hints.href} target="_blank">{element}</a>
	}

	state.element = element
	return state
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

export default function to_react(doc) {
	//console.log('Rendering a rich text:', doc)
	return walk(doc, callbacks).element
}
