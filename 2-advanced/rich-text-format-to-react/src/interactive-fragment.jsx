import React, { Component, Fragment } from 'react'

import { StatefulToolTip } from 'react-portal-tooltip'
import { Modal } from 'react-overlays'



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


export class InteractiveRichTextFragment extends Component {

	constructor (props) {
		super(props)
		this.state = {
			show_modal: false
		}
	}


	close_modal = () => {
		this.setState({ show_modal: false });
	}

	on_click = () => {
		this.setState({ show_modal: true });
		this.props.on_click(this.props.UUID)
	}

	render() {
		const {
			UUID,
			react_representation,
			render,
			render_tooltip,
		} = this.props

		const content_without_actions = render
			? render({
				UUID,
				react_representation,
			}) || react_representation
			: react_representation

		let element = (
				<button key={UUID + '-content'} className="o⋄rich-text⋄interactive" onClick={this.on_click}>
					{content_without_actions}
				</button>
			)

		const tooltip = render_tooltip
			? render_tooltip({
				UUID,
				react_representation,
			})
			: null

		if (tooltip) {
			element = (
				<StatefulToolTip key={UUID + '-tooltip-wrapper'} parent={element} position="left" align="left">
					{tooltip}
				</StatefulToolTip>
			)
		}

		return (
			<Fragment key={UUID}>
				{element}

				<Modal
					key={UUID + '-modal'}
					aria-labelledby='modal-label'
					show={this.state.show_modal}
					onHide={this.close_modal}
					style={modalStyle}
					backdropStyle={backdropStyle}
				>
					<div className="o⋄rich-text⋄modal__dialog" style={dialogStyle()} >
						{content_without_actions}
					</div>
				</Modal>
			</Fragment>
		)
	}
}
InteractiveRichTextFragment.defaultProps = {
	on_click: (UUID) => { console.warn(`Rich Text to React Interactive fragment: TODO implement on_click! (element #${UUID})`)},
	render_tooltip: ({react_representation}) => react_representation, // TODO remove
};
