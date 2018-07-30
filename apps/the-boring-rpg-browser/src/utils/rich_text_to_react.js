"use strict";

import React from 'react'
const { to_react, intermediate_on_node_exit, intermediate_assemble } = require('@offirmo/rich-text-format-to-react')

import TBRPGElement from '../components/rich-text'

////////////
function on_node_exit(params) {
	const { children, classes, component, wrapper } = intermediate_on_node_exit(params)
	const { state, $node } = params
	const { $hints } = $node

	if (classes.includes('monster')) {
		children.push(<span className="monster-emoji">{$hints.possible_emoji}</span>)
	}

	let element = intermediate_assemble({ children, classes, component, wrapper })

	if ($hints.uuid) {
		console.log('seen element with uuid:', $node)
		element = <TBRPGElement uuid={$hints.uuid}>{element}</TBRPGElement>
	}

	state.element = element
	return state
}
////////////

export default function rich_text_to_react(doc, options) {
	//console.log(`${LIB} Rendering a rich text:`, doc)
	return to_react(
		doc,
		{
			on_node_exit,
		},
		options,
	)
}