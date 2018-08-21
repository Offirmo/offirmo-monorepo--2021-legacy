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
		const { UUID, react_representation, render, forward_ref } = this.props

		return (
			<button key={UUID + '-content'}
					ref={forward_ref}
					className="o⋄rich-text⋄interactive"
					onClick={this.on_click}
					onMouseOver={this.on_mouse_over}
					onMouseOut={this.on_mouse_out}
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

	on_mouse_over = () => {
		this.setState({ show_tooltip: true })
	}

	on_mouse_out = () => {
		this.setState({ show_tooltip: false })
	}

	on_card_click = () => {
		this.setState({ show_tooltip: false, show_modal: true })
		this.props.on_click(this.props.UUID)
	}

	on_close_modal = () => {
		this.setState({ show_modal: false })
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
				<ActiveCard
					forward_ref={this.card_ref}
					{...{UUID, react_representation, render}}
					on_click={this.on_card_click}
					on_mouse_over={this.on_mouse_over}
					on_mouse_out={this.on_mouse_out}
				/>
			)

		const detailed = render_detailed
			? render_detailed({
				UUID,
				react_representation,
			})
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
				{card}
				{tooltip}
				{modal}
			</Fragment>
		)
	}
}
InteractiveRichTextFragment.defaultProps = {
	on_click: (UUID) => { console.warn(`Rich Text to React Interactive fragment: TODO implement on_click! (element #${UUID})`)},
	render_detailed: ({react_representation}) => { // TODO remove
		return (
			<Fragment>
				{react_representation}
				<p>additional info</p>
				<p className="o⋄color⁚ancillary"><i>piece of lore</i></p>
			</Fragment>
		)
	}
};

const final = InteractiveRichTextFragment
//const final = withHoverProps(InteractiveRichTextFragment)
export default final
