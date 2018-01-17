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


function with_game_state(WrappedComponent) {
	return class WithGameState extends Component {
		static displayName = `WithGameState(${Component.displayName || Component.name})`;
		static contextTypes = {
			instance: PropTypes.object.isRequired,
		};

		render() {
			const {instance} = this.props;
			return <WrappedComponent state={instance.get_latest_state()} {...props} />;
		}
	}
}



export {
	GameInstanceProvider,
	with_game_state,
}
