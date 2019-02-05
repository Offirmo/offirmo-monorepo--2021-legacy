import React, { Component, Fragment, createRef } from 'react'
import ToolTip from 'react-portal-tooltip'
import { Modal } from 'react-overlays'
import { has_any_hover } from '@offirmo/features-detection-browser'
import ErrorBoundary from '@offirmo/react-error-boundary'

const modal_style = {
	// this is mor the backdrop than the modal, beware!
	position: 'fixed',
	zIndex: 1040, // TODO var
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
		maxWidth: '550px',
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
		maxWidth: '400px',
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

	render() {
		const { children, forward_ref } = this.props

		const props = {
			onClick: this.on_click,
		}
		if (has_any_hover()) {
			// only when possible. Avoid mobile Safari flickering.
			props.onMouseOver = this.on_mouse_over
			props.onMouseOut = this.on_mouse_out
		}

		return (
			<button key='AC.content'
					ref={forward_ref}
					className="o⋄button--inline o⋄rich-text⋄interactive"
					{...props}
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
		const {
			UUID,
			children,
			render_detailed,
		} = this.props

		console.log(`🔄 InteractiveRichTextFragment ${UUID}`)

		const base = (
				<ActiveCard key='IF.content'
					forward_ref={this.card_ref}
					on_click={this.on_card_click}
					on_mouse_over={this.on_mouse_over}
					on_mouse_out={this.on_mouse_out}
				>
					{children}
				</ActiveCard>
			)

		let detailed = <ErrorBoundary key='IF.detailed' name={`IF-${UUID}-detailed`}
				render={
					render_detailed
						? render_detailed.bind(null, {UUID, react_representation: children})
						: () => null
				}
			/>

		let tooltip = detailed && this.card_ref.current && (
				<ErrorBoundary key='IF.tooltip-wrapper'
									name={`IF-${UUID}-tooltip-wrapper`}
									onError={this.on_mouse_out}>
					<ToolTip key={UUID + '-tooltip-wrapper'}
						className="o⋄box"
						active={this.state.show_tooltip}
						parent={this.card_ref.current}
						xxtooltipTimeout={0}
						position="left"
						align="left"
						style={tooltip_style}
					>
						{detailed}
					</ToolTip>
				</ErrorBoundary>
			)

		const modal = detailed && (
			<ErrorBoundary key='IF.modal-wrapper' name={`IF-${UUID}-modal`} onError={this.on_close_modal}>
				<Modal
					key={UUID + '-modal'}
					aria-labelledby='modal-label'
					show={this.state.show_modal}
					onHide={this.on_close_modal}
					style={modal_style}
					backdropStyle={backdrop_style}
				>
					<div className="o⋄box" style={dialog_style()} >
						{detailed}
						<button onClick={this.on_close_modal}>Close</button>
					</div>
				</Modal>
			</ErrorBoundary>
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
	render_detailed: () => 'NOT IMPLEMENTED InteractiveRichTextFragment.render_detailed',
}

export default InteractiveRichTextFragment
