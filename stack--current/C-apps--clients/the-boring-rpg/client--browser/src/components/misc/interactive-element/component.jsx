import * as React from 'react'
import { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'

import { ElementType } from '@tbrpg/definitions'
import { InteractiveRichTextFragment } from '@offirmo-private/rich-text-format-to-react'
import {
	render_item_short,
	render_item_detailed,
	render_achievement_snapshot_short,
	render_achievement_snapshot_detailed,
} from '@oh-my-rpg/view-rich-text'

import logger from '../../../services/logger'
import rich_text_to_react from '../../../services/rich-text-to-react'

import ActionButton from '../action-button'

import './index.css'

function render_element_short(element) {
	switch(element.element_type) {
		case ElementType.item:
			return render_item_short(element)

		case ElementType.achievement_snapshot:
			return render_achievement_snapshot_short(element)

		default:
			logger.warn('render_element_short', {element})
			throw new Error(`Not implemented: add a short renderer for element type "${element.element_type}"!`)
	}
}

function render_element_detailed(element) {
	switch(element.element_type) {
		case ElementType.item:
			return render_item_detailed(element)

		case ElementType.achievement_snapshot:
			return render_achievement_snapshot_detailed(element)

		default:
			logger.warn('render_element_detailed', {element})
			throw new Error(`Not implemented: add a detailed renderer for element type "${element.element_type}"!`)
	}
}

// = usually displayed inline (only used in dev for now TODO cleanup)
const Short = React.memo(
	function Short({children, element}) {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 InteractiveElementShort')

		return (
			<span>
				{children || rich_text_to_react(render_element_short(element), {render_interactive: false})}
			</span>
		)
	},
)

// = displayed in tooltip
const Detailed = React.memo(
	function Detailed({element, actions = []}) {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 InteractiveElementDetailed')

		return (
			<Fragment>
				{rich_text_to_react(render_element_detailed(element), {render_interactive: false})}
				{actions.map(action => (<ActionButton key={action.type} action={action}/>))}
			</Fragment>
		)
	},
)

// alternate from short to detailed
class Interactive extends PureComponent {
	static propTypes = {
		UUID: PropTypes.string.isRequired,
		children: PropTypes.element.isRequired,
	}

	render_detailed = ({UUID, react_representation}) => {
		const {element, actions} = this.props
		return <Detailed {...{element, actions}} />
	}

	render = () => {
		const { UUID, children } = this.props
		//console.log(`🔄 InteractiveElement ${UUID}`)

		return (
			<InteractiveRichTextFragment
				key="IRTF"
				UUID={UUID}
				render_detailed={this.render_detailed}
			>
				{children}
			</InteractiveRichTextFragment>
		)
	}
}

export {
	Short,
	Detailed,
	Interactive,
}
