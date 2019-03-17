import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { ELEMENTS } from '@oh-my-rpg/rsrc-backgrounds'
import '@oh-my-rpg/rsrc-backgrounds/src/index.css'

import { UStateListenerAndProvider } from '../../../../context'
import get_game_instance from '../../../../services/game-instance-browser'
import View from './component'


class Scenery extends Component {
	static propTypes = {
	}

	render_view = ({ u_state }) => {
		const { good_play_count } = get_game_instance()
			.queries.get_sub_state('progress')
			.statistics

		const bg = ELEMENTS[good_play_count % ELEMENTS.length]
		const next_bg = ELEMENTS[(good_play_count + 1) % ELEMENTS.length]

		return <View bg={bg} next_bg={next_bg} />
	}

	render() {
		return (
			<UStateListenerAndProvider render={this.render_view} />
		)
	}
}

export default Scenery
