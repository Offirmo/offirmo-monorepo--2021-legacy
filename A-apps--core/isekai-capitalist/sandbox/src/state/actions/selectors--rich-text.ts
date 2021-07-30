import { Immutable } from '@offirmo-private/ts-types'
import { NORMALIZERS } from '@offirmo-private/normalize-string'
import * as RichText from '@offirmo-private/rich-text-format'

import { State } from '../types'
import { Action, ActionType } from './types'


const TYPE_TO_LABEL: { [type: string]: string } = {
	[ActionType.defeat_BBEG]: 'Defeat the demon lord',
	[ActionType.explore]: 'Explore the world',
	[ActionType.quest]: 'Fulfill a guild quest',
	[ActionType.rank_upⵧguild]: 'Take the guild rank-up exam',
	[ActionType.romance]: 'Romance the heroine',
	[ActionType.defeat_mook]: 'Defeat some mook(s)',
}

export function render_action(action: Immutable<Action>, state: Immutable<State>, options?: {}): RichText.Document {
	const $doc = RichText.inline_fragment()
		.pushText((() => {
			switch (action.type) {

				// @ts-expect-error
				case ActionType.set:
					if (action.state === null) return '[reset game]'

				// @ts-expect-error
				case ActionType.rank_upⵧguild:
					if (!state.mc.guild.rank) return 'Register to the Adventurer’s Guild'

				default:
					return TYPE_TO_LABEL[action.type] || NORMALIZERS.capitalize(NORMALIZERS.coerce_delimiters_to_space(action.type))
			}
		})())
		.done()

	return $doc
}
