import React from 'react'

import { SCHEMA_VERSION, GAME_VERSION } from '@oh-my-rpg/state-the-boring-rpg'
import { render_account_info } from '@oh-my-rpg/view-rich-text'

import { with_game_instance } from '../../context/game-instance-provider'
import { rich_text_to_react } from '../../../utils/rich_text_to_react'


class MetaBase extends React.Component {

	componentWillMount () {
		console.info('~~ MetaBase componentWillMount')

		this.props.instance.set_client_state(client_state => ({
			mode: 'meta',
		}))
	}

	componentDidMount() {
		console.info('~~ MetaBase componentDidMount')
		// subscribe to future state changes
		this.unsubscribe = this.props.instance.subscribe(() => this.forceUpdate())
	}
	componentWillUnmount () {
		console.info('~~ MetaBase componentWillUnmount', arguments)
		this.unsubscribe()
	}

	render() {
		const { instance } = this.props
		const state = instance.get_latest_state()

		const doc = render_account_info(state.meta, {
			'engine version': GAME_VERSION,
			'savegame version': SCHEMA_VERSION,
			'play count': state.good_click_count,
		})

		return (
			<div className={'page page--meta'}>
				{rich_text_to_react(doc)}
			</div>
		)
	}
}

const Meta = with_game_instance(MetaBase)

export {
	Meta,
}
