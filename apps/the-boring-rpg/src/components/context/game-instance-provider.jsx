import React from 'react'
import * as PropTypes from 'prop-types'


class GameInstanceProvider extends React.Component {
	static childContextTypes = {
		instance: PropTypes.object.isRequired,
	}

	getChildContext() {
		return {
			instance: this.props.instance,
		}
	}

	render() {
		return this.props.children
	}
}


function with_game_instance(WrappedComponent) {

	return class WithGameInstance extends React.Component {

		static displayName = `WithGameInstance(${WrappedComponent.displayName || WrappedComponent.name})`

		static contextTypes = {
			instance: PropTypes.object.isRequired,
		}

		render() {
			const {instance} = this.context;
			return (
				<WrappedComponent
					instance={instance}
					state={instance.get_latest_state()}
					{...this.props} />
			)
		}
	}
}



export {
	GameInstanceProvider,
	with_game_instance,
}
