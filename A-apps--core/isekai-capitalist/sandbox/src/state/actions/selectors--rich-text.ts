import { Immutable } from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'

import { State } from '../types'
import { Action, ActionType } from './types'



export function render_action(action: Immutable<Action>, state: Immutable<State>, options?: {}): RichText.Document {
	const $doc = RichText.inline_fragment()
		.pushText((() => {
			if (action.type === ActionType.set && action.state === null)
				return 'restart'

			return action.type
		})())
		.done()

	return $doc
}
