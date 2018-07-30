import React from 'react'
import { StatefulToolTip } from "react-portal-tooltip"


export function InteractiveRichTextElement({
	UUID,
	on_click,
	react_representation,
	render,
	render_tooltip,
 }) {
	const parent = render
		? render({
				UUID,
				on_click,
				react_representation,
				render_tooltip,
			})
		: (
			<button key={UUID} className="o⋄rich-text⋄interactive" onClick={() => on_click(UUID)}>
				{react_representation}
			</button>
		)

	const tooltip = render_tooltip
		? render_tooltip({
			UUID,
			on_click,
			react_representation,
		})
		: null

	return tooltip
			? (
				<StatefulToolTip parent={parent} position="left" align="left" tooltipTimeout={250} group="foo">
					{tooltip}
				</StatefulToolTip>
			)
			: parent
}
InteractiveRichTextElement.defaultProps = {
	on_click: (UUID) => { console.warn(`Rich Text to React Interactive element: TODO implement on_click! (element #${UUID})`)},
	render_tooltip: ({react_representation}) => react_representation,
};
