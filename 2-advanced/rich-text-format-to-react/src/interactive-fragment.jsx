import React, { Component, Fragment, createRef } from 'react'
import ToolTip from 'react-portal-tooltip'
import { Modal } from 'react-overlays'


const modal_style = {
	position: 'fixed',
	zIndex: 1040, // TODO
	top: 0, bottom: 0, left: 0, right: 0,
}
const backdrop_style = {
	...modal_style,
	zIndex: 'auto',
	backgroundColor: '#000',
	opacity: 0.5
}
const dialog_style = function() {
	let top = 50
	let left = 50

	return {
		position: 'absolute',
		top: top + '%', left: left + '%',
		transform: `translate(-${top}%, -${left}%)`,
		boxShadow: '0 5px 15px rgba(0,0,0,.5)',
	}
}

const tooltip_style = {
	style: {
		padding: '.5em',
		backgroundColor: 'var(--o⋄color--bg⁚main)',
		borderRadius: '0',
		zIndex: 'auto',
		border: 'solid calc(var(--o⋄border--thickness) * 1) var(--o⋄color--fg⁚main)',
		boxShadow: '0 5px 15px rgba(0,0,0,.5)',
	},
	arrowStyle: {},
}

// Put content inside a button together with hover callbacks
class ActiveCard extends Component {
	constructor(props) {
		//console.log('hx')
		super(props)
	}

	on_click = (...args) => {
		if (this.props.on_click)
			this.props.on_click(...args)
	}

	on_mouse_over = (...args) => {
		if (this.props.on_mouse_over)
			this.props.on_mouse_over(...args)
	}

	on_mouse_out = (...args) => {
		if (this.props.on_mouse_out)
			this.props.on_mouse_out(...args)
	}

	render = () => {
		const { children, forward_ref } = this.props

		return (
			<button
					ref={forward_ref}
					className="o⋄rich-text⋄interactive"
					onClick={this.on_click}
					onMouseOver={this.on_mouse_over}
					onMouseOut={this.on_mouse_out}
			>
				{children}
			</button>
		)
	}
}


export class InteractiveRichTextFragment extends Component {

	constructor (props) {
		super(props)
		this.state = {
			show_tooltip: false,
			show_modal: false,
		}
		this.card_ref = createRef()
	}

	on_mouse_over = () => {
		this.setState({ show_tooltip: true })
	}

	on_mouse_out = () => {
		this.setState({ show_tooltip: false })
	}

	on_card_click = () => {
		this.setState({ show_tooltip: false, show_modal: true })
	}

	on_close_modal = () => {
		this.setState({ show_modal: false })
	}

	render = () => {
		//console.log('render', this.element)
		const {
			UUID,
			children,
			render_detailed,
		} = this.props

		const base = (
				<ActiveCard key={UUID + '-content'}
					forward_ref={this.card_ref}
					on_click={this.on_card_click}
					on_mouse_over={this.on_mouse_over}
					on_mouse_out={this.on_mouse_out}
				>
					{children}
				</ActiveCard>
			)

		const detailed = render_detailed
			? render_detailed({UUID, react_representation: children})
			: null

		let tooltip = detailed && (
				<ToolTip key={UUID + '-tooltip-wrapper'}
					className="o⋄box"
					active={this.state.show_tooltip}
					parent={this.card_ref.current}
					tooltipTimeout={0}
					position="left"
					align="left"
					style={tooltip_style}
				>
					{detailed}
				</ToolTip>
			)

		const modal = detailed && (
			<Modal
				key={UUID + '-modal'}
				aria-labelledby='modal-label'
				show={this.state.show_modal}
				onHide={this.on_close_modal}
				style={modal_style}
				backdropStyle={backdrop_style}
			>
				<div className="o⋄box o⋄rich-text⋄modal__dialog" style={dialog_style()} >
					{detailed}
				</div>
			</Modal>
		)

		return (
			<Fragment key={UUID}>
				{base}
				{tooltip}
				{modal}
			</Fragment>
		)
	}
}
InteractiveRichTextFragment.defaultProps = {
	// UUID,
	render_detailed: () => 'TODO InteractiveRichTextFragment.render_detailed',
}

export default InteractiveRichTextFragment
