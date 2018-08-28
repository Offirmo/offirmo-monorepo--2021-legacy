"use strict";

import React from 'react'

const {
	to_react,
	intermediate_on_node_exit,
	intermediate_assemble,
} = require('@offirmo/rich-text-format-to-react')

import { Interactive } from '../components/misc/interactive-element'
import './rich-text-to-react.css'

////////////

function on_node_exit(params, options) {
	const { children, classes, component, wrapper } = intermediate_on_node_exit(params, options)
	const { state, $node } = params
	const { $hints } = $node

	if (classes.includes('monster')) {
		children.push(<span className="monster-emoji">{$hints.possible_emoji}</span>)
	}

	let element = intermediate_assemble({ children, classes, component, wrapper }, options)

	if ($hints.uuid && options.render_interactive) {
		element = (
			<Interactive key={$hints.uuid} UUID={$hints.uuid}>
				{element}
			</Interactive>
		)
	}

	state.element = element
	return state
}
////////////

const DEFAULT_OPTIONS = {
	render_interactive: true,
}

export default function rich_text_to_react(doc, options = DEFAULT_OPTIONS) {
	options = {
		...DEFAULT_OPTIONS,
		...options,
	}

	//console.log(`${LIB} Rendering a rich text:`, doc)
	return to_react(
		doc,
		{
			on_node_exit,
		},
		options,
	)
}
