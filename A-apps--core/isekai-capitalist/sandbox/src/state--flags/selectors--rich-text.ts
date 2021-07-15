import { Immutable } from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'

import { State } from './types'
import {
	has_saved_the_world,
	has_found_their_soulmate,
	has_improved_civilization,
} from './selectors--challenge'


export function render(state: Immutable<State>, options?: {}): RichText.Document {
	const $doc = RichText.unordered_list()
		.pushKeyValue('Has saved the world', has_saved_the_world(state)             ? 'yes ✅' : '❌ not yet')
		.pushKeyValue('Has found their soulmate', has_found_their_soulmate(state)   ? 'yes ✅' : '❌ not yet')
		.pushKeyValue('Has improved civilization', has_improved_civilization(state) ? 'yes ✅' : '❌ not yet')
		.done()

	return $doc
}
