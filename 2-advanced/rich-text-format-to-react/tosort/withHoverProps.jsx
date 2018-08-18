// copied from https://github.com/klarna/higher-order-components/blob/master/src/withHoverProps.js

import React, { Component } from 'react'
import wrapDisplayName from 'recompose/wrapDisplayName'

const global_state = {

}

export function withHoverPropsCreator(hoverProps) {
	return Target => {
		class WithHoverProps extends Component {
			constructor(props) {
				//console.log('hx')
				super(props)

				this.state = {
					hovered: false,
				}
			}

			onMouseOver = (...args) => {
				console.log('h+')
				this.setState({ hovered: true })

				if (this.props.on_mouse_over)
					this.props.on_mouse_over(...args)
			}

			onMouseOut = (...args) => {
				console.log('h-')
				this.setState({ hovered: false })

				if (this.props.on_mouse_out)
					this.props.on_mouse_out(...args)
			}

			render = () => {
				let props = {
					...this.props,
					forceMouseOut: this.onMouseOut
				}
				if (this.state.hovered)
					props = {
						...props,
						...hoverProps,
					}
				return (
					<div
						onMouseOver={this.onMouseOver}
						onMouseOut={this.onMouseOut}>
						<Target {...props} />
					</div>
				)
			}
		}

		WithHoverProps.displayName = wrapDisplayName(Target, 'withHoverProps')

		return WithHoverProps
	}
}

export default withHoverPropsCreator({hovered: true})
