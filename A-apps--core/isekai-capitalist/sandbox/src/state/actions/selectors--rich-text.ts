import { Immutable } from '@offirmo-private/ts-types'
import { NORMALIZERS } from '@offirmo-private/normalize-string'
import * as RichText from '@offirmo-private/rich-text-format'

import { State } from '../types'
import { Action, ActionType } from './types'


export function render_action(action: Immutable<Action>, state: Immutable<State>, options?: {}): RichText.Document {
	const $doc = RichText.inline_fragment()
		.pushText((() => {
			if (action.type === ActionType.set && action.state === null)
				return 'restart'

			return NORMALIZERS.coerce_delimiters_to_space(action.type)
		})())
		.done()

	return $doc
}
