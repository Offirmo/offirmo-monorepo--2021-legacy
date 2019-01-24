import React from 'react'

import get_game_instance from '../../../services/game-instance-browser'

import {
	Short as UnconnectedShort,
	Detailed as UnconnectedDetailed,
	Interactive as UnconnectedInteractive,
} from './component'

const game_instance = get_game_instance()

function with_element_and_action(Component) {
	return (props) => {
		const { UUID } = props
		const element = game_instance.selectors.find_element(UUID)
		if (!element) {
			console.warn(`interactive element not found!`, UUID, props)
			// element disappeared. This happen transitively (ex. sold)
			// due to my crappy change listening technique.
			// TODO check if that still happen since the refactor
			return props.children
		}

		const actions = game_instance.selectors.get_actions_for_element(UUID)

		props = {
			...props,
			element,
			actions,
		}
		return <Component {...props} />
	}
}

const Short = with_element_and_action(UnconnectedShort)
const Detailed = with_element_and_action(UnconnectedDetailed)
const Interactive = with_element_and_action(UnconnectedInteractive)

export {
	Short,
	Detailed,
	Interactive,
}
