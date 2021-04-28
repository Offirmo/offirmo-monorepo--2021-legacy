'use strict'

import {
	to_react,
	generate_react_key,
	intermediate_on_node_exit,
	intermediate_assemble,
} from '@offirmo-private/rich-text-format-to-react'

import { Interactive } from '../components/misc/interactive-element'
import './rich-text-to-react.css'

/////////////////////////////////////////////////

function on_node_exit(params, options) {
	const { children, classes, component, wrapper } = intermediate_on_node_exit(params, options)
	const { state, $node, $id } = params
	const { $hints } = $node

	//console.warn('final on_node_exit', state)

	if (classes.includes('monster')) {
		children.push(<span key={$id} className="monster-emoji">{$hints.possible_emoji}</span>)
	}

	let element = intermediate_assemble({ ...params, children, classes, component, wrapper }, options)

	if ($hints.uuid && options.render_interactive) {
		element = (
			<Interactive
				key={generate_react_key({$id, $node})}
				UUID={$hints.uuid}
			>
				{element}
			</Interactive>
		)
	}

	state.element = element
	return state
}

////////////

const DEFAULT_OPTIONS = {
	key: 'rich-text-to-react[TBRPG]--root',
	render_interactive: true,
}

export default function rich_text_to_react(doc, options = {}) {
	//console.log(`${LIB} Rendering a rich text:`, doc)
	return to_react(
		doc,
		{
			on_node_exit,
		},
		{
			...DEFAULT_OPTIONS,
			...options,
		},
	)
}
