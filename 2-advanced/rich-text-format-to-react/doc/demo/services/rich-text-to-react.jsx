import React from 'react'

import {
	to_react,
	intermediate_on_node_exit,
	intermediate_assemble,
	InteractiveRichTextFragment,
} from '../../..'

////////////

function on_node_exit(params, options) {
	const { children, classes, component, wrapper } = intermediate_on_node_exit(params, options)
	const { state, $node, $id } = params
	const { $hints } = $node

	if (classes.includes('monster')) {
		children.push(<span key={$id} className="monster-emoji">{$hints.possible_emoji}</span>)
	}

	let element = intermediate_assemble({ $id, children, classes, component, wrapper }, options)

	if ($hints.uuid) {
		//console.log(`${LIB} seen element with uuid:`, $node)
		const UUID = $hints.uuid
		const base = element
		const render_detailed = () => {
			return (
				<React.Fragment>
					{base}
					<p>additional info</p>
					<p className="o⋄color⁚ancillary">piece of lore</p>
					<button>foo</button>
					<button>bar</button>
				</React.Fragment>
			)
		}
		element = (
			<InteractiveRichTextFragment
				key={$id}
				UUID={UUID}
				render_detailed={render_detailed}
			>
				{base}
			</InteractiveRichTextFragment>
		)
	}

	state.element = element
	return state
}

////////////

export default function rich_text_to_react(doc, options = {}) {
	//console.log(`${LIB} Rendering a rich text:`, doc)
	return to_react(
		doc,
		{
			on_node_exit,
		},
		{
			...options,
			key: options.key || 'rich-text-to-react[DEMO]--root'
		},
	)
}
