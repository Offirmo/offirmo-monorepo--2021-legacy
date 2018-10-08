import React from 'react'
import poll_window_variable from '@offirmo/poll-window-variable'
import { create_game_instance } from '@oh-my-rpg/state-the-boring-rpg'

import { LS_KEYS } from './services/consts'
import { CHANNEL } from './services/channel'
import SEC from './services/sec'

let game_instance = null

SEC.xTry('loading savegame + creating game instance', ({logger}) => {
	logger.verbose(`Storage key: "${LS_KEYS.savegame}"`)

	let lscontent = localStorage.getItem(LS_KEYS.savegame) || localStorage.getItem('XOF.the-boring-rpg.savegame')
	localStorage.removeItem('XOF.the-boring-rpg.savegame')

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
		persist_state: new_state => {
			state = new_state // we are responsible for storing current state
			localStorage.setItem(LS_KEYS.savegame, JSON.stringify(state))
		},
	})
})

SEC.xTry('init client state', ({logger}) => {
	const netlifyIdentity = poll_window_variable('netlifyIdentity', { timeoutMs: 30 * 1000 })

	game_instance.set_client_state(() => ({
		CHANNEL,
		netlifyIdentity,
		// can change:
		mode: 'explore',
		//alpha_warning_displayed: false,
		recap_displayed: false,
		last_displayed_adventure_uuid: (() => {
			const { last_adventure } = game_instance.get_latest_state()
			return last_adventure && last_adventure.uuid
		})()
	}))

	netlifyIdentity.then(NetlifyIdentity => {
		console.info('Netlify Identity loaded')

		//NetlifyIdentity.open("signup")
		/*NetlifyIdentity.init({
           container: "#netlify-modal" // defaults to document.body,
       });*/

		/*NetlifyIdentity.open(); // open the modal
       NetlifyIdentity.open("login"); // open the modal to the login tab
       NetlifyIdentity.open("signup"); // open the modal to the signup tab*/

		NetlifyIdentity.on("init", user => console.info('netlify init', user));
		NetlifyIdentity.on("login", user => console.info('netlify login', user));
		NetlifyIdentity.on("logout", () => console.info("netlify Logged out"));
		NetlifyIdentity.on("error", err => console.error("netlify error", err));
		NetlifyIdentity.on("open", () => console.info("netlify Widget opened"));
		NetlifyIdentity.on("close", () => console.info("netlify Widget closed"));
	})
})


const GameContext = React.createContext(game_instance)

class GameContextAsPropsListener extends React.Component {
	componentDidMount() {
		//console.info('~~ GameContextListener componentDidMount')
		// subscribe to future state changes
		this.unsubscribe = this.props.game_instance.subscribe(() => {
			//console.log('forcing update on game state change')
			this.forceUpdate()
		})
	}
	componentWillUnmount () {
		//console.info('~~ GameContextListener componentWillUnmount', arguments)
		this.unsubscribe()
	}

	render() {
		return this.props.children(game_instance)
	}
}

function GameContextConsumerListener({children}) {
	return (
		<GameContext.Consumer>
			{game_instance => {
				//console.log('GameContextConsumerListener re-called')
				return (
					<GameContextAsPropsListener game_instance={game_instance}>
						{children}
					</GameContextAsPropsListener>
				)
			}}
		</GameContext.Consumer>
	)
}

export {
	game_instance,
	GameContext,
	GameContextConsumerListener,
}

export default GameContext
