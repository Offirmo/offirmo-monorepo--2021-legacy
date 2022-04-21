import { Component, Fragment, createRef } from 'react'
import ToolTip from 'react-portal-tooltip'
import { Modal } from 'react-overlays'
import { has_any_hover } from '@offirmo-private/features-detection-browser'
import ErrorBoundary from '@offirmo-private/react-error-boundary'

const modal_style = {
	zIndex: 1040,
	/*position: 'fixed',
	width: 400,
	top: top + '%',
	left: left + '%',
	border: '1px solid #e5e5e5',
	backgroundColor: 'white',
	boxShadow: '0 5px 15px rgba(0,0,0,.5)',
	padding: 20*/
}
const backdrop_style = {
	position: 'fixed',
	zIndex: 1040, // TODO var
	top: 0, bottom: 0, left: 0, right: 0,
	backgroundColor: '#000',
	opacity: 0.5,
}
const dialog_style = function() {
	const top = 50
	const left = 50

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
		backgroundColor: 'var(--o⋄color⁚bg--main)',
		borderRadius: '0',
		//zIndex: 'auto',
		zIndex: 1039,
		border: 'solid calc(var(--o⋄border--thickness) * 1) var(--o⋄color⁚fg--main)',
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
			<button key="AC.content"
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

	on_request_close_modal = () => {
		console.log('on_request_close_modal')
		this.setState({ show_modal: false })
	}

	render_backdrop = (props) => {
		return (
			<div
				{...props}
				style={backdrop_style}
				onClick={this.on_request_close_modal}
			>Backdrop! </div>
		)
	}


	render = () => {
		const {
			UUID,
			children,
			render_detailed,
		} = this.props

		// TODO check re-render of this
		//console.log(`🔄 InteractiveRichTextFragment ${UUID}`)

		const base = (
			<ActiveCard key="IF.content"
				forward_ref={this.card_ref}
				on_click={this.on_card_click}
				on_mouse_over={this.on_mouse_over}
				on_mouse_out={this.on_mouse_out}
			>
				{children}
			</ActiveCard>
		)

		const detailed = <ErrorBoundary key="IF.detailed" name={`IF-${UUID}-detailed`}
			render={
				render_detailed
					? render_detailed.bind(null, {UUID, react_representation: children})
					: () => null
			}
		/>

		const tooltip = detailed && has_any_hover() && this.card_ref.current && (
			<ErrorBoundary key="IF.tooltip-wrapper"
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
			<ErrorBoundary key="IF.modal-wrapper" name={`IF-${UUID}-modal`} onError={this.on_request_close_modal}>
				<Modal
					key={UUID + '-modal'}
					onHide={this.on_request_close_modal}
					style={modal_style}
					aria-labelledby="modal-label"
					show={this.state.show_modal}
					renderBackdrop={this.render_backdrop}
				>
					<div className="o⋄box o⋄bg-colorꘌbackdrop" style={dialog_style()} >
						{detailed}
						<button onClick={this.on_request_close_modal}>Close</button>
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
