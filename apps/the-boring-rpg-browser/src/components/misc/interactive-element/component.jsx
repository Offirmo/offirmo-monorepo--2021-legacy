import React, { Component, Fragment } from 'react'

const { InteractiveRichTextFragment } = require('@offirmo/rich-text-format-to-react')
import { render_item_short, render_item_detailed } from '@oh-my-rpg/view-rich-text'

import rich_text_to_react from '../../../services/rich-text-to-react'

import ActionButton from '../action-button'

import './index.css'

function Short({children, element}) {
	return (
		<span>
			{children || rich_text_to_react(render_item_short(element), {render_interactive: false})}
		</span>
	)
}

function Detailed({element, actions = []}) {
	return (
		<Fragment>
			{rich_text_to_react(render_item_detailed(element), {render_interactive: false})}
			{actions.map(action => (<ActionButton key={action.type} action={action}/>))}
		</Fragment>
	)
}

class Interactive extends Component {
	constructor(props) {
		super(props)
	}

	render_detailed = ({UUID, react_representation}) => {
		const {element, actions} = this.props
		return <Detailed {...{element, actions}} />
	}

	render = () => {
		const { UUID, children } = this.props
		return (
			<InteractiveRichTextFragment
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
