import React, { Component, Fragment, createRef } from 'react'
//import { createPortal, findDOMNode } from 'react-dom'
import ToolTip from 'react-portal-tooltip'
import { Modal } from 'react-overlays'

import withHoverProps from './withHoverProps'
//import { Manager, Reference, Popper } from 'react-popper';


const modalStyle = {
	position: 'fixed',
	zIndex: 1040,
	top: 0, bottom: 0, left: 0, right: 0
};

const backdropStyle = {
	...modalStyle,
	zIndex: 'auto',
	backgroundColor: '#000',
	opacity: 0.5
};

const dialogStyle = function() {
	let top = 50
	let left = 50

	return {
		position: 'absolute',
		//width: 400,
		top: top + '%', left: left + '%',
		transform: `translate(-${top}%, -${left}%)`,
		border: '1px solid #e5e5e5',
		backgroundColor: 'white',
		boxShadow: '0 5px 15px rgba(0,0,0,.5)',
		padding: 20,
		outline: 'none',
	}
};

function Card({UUID, react_representation, render}) {
	return render
		? render({
				UUID,
				react_representation,
			}) || react_representation
		: react_representation
}

class ActiveCard extends Component {
	constructor(props) {
		//console.log('hx')
		super(props)

		this.state = {
			hovered: false,
		}
	}

	on_click = (...args) => {
		console.log('h-f')
		this.setState({ hovered: false })

		if (this.props.on_click)
			this.props.on_click(...args)
	}

	on_mouse_over = (...args) => {
		console.log('h+')
		this.setState({ hovered: true })

		if (this.props.on_mouse_over)
			this.props.on_mouse_over(...args)
	}

	on_mouse_out = (...args) => {
		console.log('h-')
		this.setState({ hovered: false })

		if (this.props.on_mouse_out)
			this.props.on_mouse_out(...args)
	}

	render = () => {
		const {UUID, react_representation, render} = this.props

		return (
			<button key={UUID + '-content'}
					className="o⋄rich-text⋄interactive"
					onClick={this.on_click}
					onMouseOver={this.on_mouse_over}
					onMouseOut={this.on_mouse_out}>
			>
				<Card {...{UUID, react_representation, render}} />
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

	close_modal = () => {
		this.setState({ show_modal: false })
	}

	on_card_click = () => {
		this.setState({ show_modal: true })
		this.props.on_click(this.props.UUID)
	}

	render = () => {
		//console.log('render', this.element)
		const {
			UUID,
			react_representation,
			render,
			render_detailed,
		} = this.props

		const card = (
			<InteractiveCard
			/>
		)

		const content_without_actions = render
			? render({
				UUID,
				react_representation,
			}) || react_representation
			: react_representation

		let element = (
			<button key={UUID + '-content'} className="o⋄rich-text⋄interactive"
					ref={this.card_ref}
					onClick={this.on_card_click}
			>
				{content_without_actions}
			</button>
		)

		const detailed = render_detailed
			? render_detailed({
				UUID,
				react_representation,
			})
			: null

		let tooltip = detailed

		if (tooltip) {
			tooltip = (
				<ToolTip key={UUID + '-tooltip-wrapper'}
					active={this.props.hovered}
					parent={this.card_ref.current}
					tooltipTimeout={0}
					position="left"
					align="left"
				>
					{tooltip}
				</ToolTip>
			)
		}

		const modal = (
			<Modal
				key={UUID + '-modal'}
				aria-labelledby='modal-label'
				show={this.state.show_modal}
				onHide={this.close_modal}
				style={modalStyle}
				backdropStyle={backdropStyle}
			>
				<div className="o⋄rich-text⋄modal__dialog" style={dialogStyle()} >
					{detailed}
				</div>
			</Modal>
		)

		return (
			<Fragment key={UUID}>
				{element}
				{tooltip}
				{modal}
			</Fragment>
		)
	}
}
InteractiveRichTextFragment.defaultProps = {
	on_click: (UUID) => { console.warn(`Rich Text to React Interactive fragment: TODO implement on_click! (element #${UUID})`)},
	render_detailed: ({react_representation}) => react_representation, // TODO remove
};

//const final = InteractiveRichTextFragment
const final = withHoverProps(InteractiveRichTextFragment)
export default final
