import * as React from 'react'

import { to_react } from '@offirmo-private/rich-text-format-to-react'

import '@oh-my-rpg/ui--browser--css/src/style.css'


////////////////////////////////////////////////////////////////////////////////////
import { create, randomize_post_create } from '../state/reducers'
import { get_available_actions } from '../state/actions/selectors'
import { reduce_action } from '../state/actions/reducers'
import { render as render_state } from '../state/selectors--rich-text'
import { render_action } from '../state/actions/selectors--rich-text'

export default function Game() {
	const [ state, dispatch ] = React.useReducer(reduce_action, randomize_post_create(create()))
	console.log('🔄 Game', { state })

	return (
		<main>
			<h1>Isekai RPG</h1>
			<hr />
			{ to_react(render_state(state)) }
			<hr />
			{ get_available_actions(state).map(action => (
				<button key={action.type} onClick={() => dispatch(action)}>
					{to_react(render_action(action, state))}
				</button>
			)) }
		</main>
	)
}
