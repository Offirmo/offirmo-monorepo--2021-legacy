import React from 'react'

import { create_game_instance } from '@oh-my-rpg/state-the-boring-rpg'

import { LS_KEYS } from './services/consts'
import SEC from './services/sec'

const CHANNEL = window.location.hostname === 'www.online-adventur.es'
	? 'stable'
	: window.location.hostname === 'offirmo.netlify.com'
		? 'beta'
		: 'dev'

let game_instance = null

SEC.xTry('loading savegame', ({logger}) => {
	logger.verbose(`Storage key: "${LS_KEYS.savegame}"`)
	const lscontent = localStorage.getItem(LS_KEYS.savegame)

	let state = null
	try {
		if (lscontent)
			state = JSON.parse(lscontent)
	}
	catch (err) {
		// TODO log / report??
	}

	game_instance = create_game_instance({
		SEC,
		get_latest_state: () => state,
		update_state: new_state => {
			state = new_state // TODO needed?
			localStorage.setItem(LS_KEYS.savegame, JSON.stringify(state))
		},
	})
	game_instance.set_client_state(() => ({
		VERSION: WI_VERSION,
		ENV: WI_ENV,
		BUILD_DATE: WI_BUILD_DATE,
		CHANNEL,
		verbose: true, // XXX auto + through SEC ?
		SEC,
		alpha_warning_displayed: false,
		recap_displayed: false,
		last_displayed_adventure_uuid: (() => {
			const { last_adventure } = state
			return last_adventure && last_adventure.uuid
		})()
	}))
})

const GameContext = React.createContext(game_instance)



class GameContextAsPropsListener extends React.Component {

	componentDidMount() {
		//console.info('~~ GameContextListener componentDidMount')
		// subscribe to future state changes
		this.unsubscribe = this.props.game_instance.subscribe(() => this.forceUpdate())
	}
	componentWillUnmount () {
		//console.info('~~ GameContextListener componentWillUnmount', arguments)
		this.unsubscribe()
	}

	render() {
	  return this.props.children
	}
 }

 function GameContextConsumerListener(props) {
	 return (
		<GameContext.Consumer>
			{game_instance => (
				<GameContextAsPropsListener game_instance={game_instance}>
					{props.children(game_instance)}
				</GameContextAsPropsListener>
			)}
		</GameContext.Consumer>
	 )
 }

export {
	game_instance,
	GameContext,
	GameContextConsumerListener,
}

export default GameContext
