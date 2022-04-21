import * as React from 'react'

import {
	to_react,
	intermediate_on_node_exit,
	intermediate_assemble,
	InteractiveRichTextFragment,
} from '../../..'

////////////

function on_node_exit(params, options) {
	const { children, classes, component, wrapper } = intermediate_on_node_exit(params, options)
	const { state, $node: { $hints }, $id } = params

	if (classes.includes('monster')) {
		children.push(<span key={$id} className="monster-emoji">{$hints.possible_emoji}</span>)
	}

	let element = intermediate_assemble({ ...params, children, classes, component, wrapper }, options)

	if ($hints.uuid) {
		//console.log(`${LIB} seen element with uuid:`, $node)
		const UUID = $hints.uuid
		const base = element
		const render_detailed = () => {
			return (
				<React.Fragment>
					{base}
					<p>additional info</p>
					<p className="o⋄colorꘌancillary">piece of lore</p>
					<button>foo</button>
					<button>bar</button>
				</React.Fragment>
			)
		}

		// note: key with UUID is needed in case the popup is open
		// and the parent element changes, ex. inventory item swap
		element = (
			<InteractiveRichTextFragment
				key={`IRTF.${$id}.uuid:${UUID}`}
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

const DEFAULT_OPTIONS = {
	key: 'rich-text-to-react[DEMO]--root',
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
