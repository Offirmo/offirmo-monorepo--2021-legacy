import assert from 'tiny-invariant'
import { Enum } from 'typescript-string-enums'
import { Immutable } from '@offirmo-private/ts-types'

import * as RichText from '@offirmo-private/rich-text-format'


import { LifeGreatness, State } from './types'
import {
	has_saved_the_world,
	get_life_experiences_counts,
	/*has_lived_to_the_fullest,
	has_found_their_soulmate,
	has_improved_civilization,*/
} from './selectors'

const MIN_LIFE_GREATNESS_COUNT = 9

const GREATNESS_TO_HUMAN: { [k:string]: string } = {
	[LifeGreatness.being_true_to_oneself]: 'is true to oneself',
	[LifeGreatness.great_food]: 'had great food',
	//[LifeGreatness.let_go_and_be_happy]: 'allowed themselves to be happy',
	[LifeGreatness.great_physical_condition]: 'is in great physical condition',
	[LifeGreatness.able_to_defend_oneself]: 'is strong and able to defend oneself',
	//[LifeGreatness.a_place_to_call_home]: 'has a place to call home',
	[LifeGreatness.good_friends]: 'has good friends',
	[LifeGreatness.intimacy]: 'has an intimate relationship',
	//[LifeGreatness.happy_home]: 'has a happy home',
	//[LifeGreatness.children]: 'has raised children',
	[LifeGreatness.making_a_difference]: 'made a difference',
	[LifeGreatness.being_expert_at_sth]: 'is an expert at something',
	//[LifeGreatness.improving_the_civilization]: 'improved the civilization',
	//[LifeGreatness.stimulating_conversation]: 'had stimulating conversations',
	//[LifeGreatness.great_book]: 'has read great books',
	//[LifeGreatness.great_art]: 'has seen great art',
	[LifeGreatness.travelling]: 'has travelled',
	//[LifeGreatness.ruling_the_world]: 'has ruled the world',
}
export function render_life_fulfillment(state: Immutable<State>, options?: {}): RichText.Document {
	const $doc = RichText.unordered_list()

	Object.keys(GREATNESS_TO_HUMAN).forEach(k => {
		const count = state.great_life_experiences_count[k]
		assert(typeof count === 'number', `render_life_fulfillment() should have count for "${k}"!`)
		if (count > 0) {
			$doc.pushKeyValue(GREATNESS_TO_HUMAN[k], 'yes ✅')
		}
		else {
			$doc.pushKeyValue(`???`, '❌ not yet')
		}
	})

	return $doc.done()
}


export function render(state: Immutable<State>, options?: {}): RichText.Document {
	const $doc = RichText.unordered_list()
		.pushKeyValue('Has saved the world',             has_saved_the_world(state)       ? 'yes ✅  ☀️' : '❌ not yet')
		.pushKeyValue(
			'Has lived a new life to the fullest',
			RichText.inline_fragment()
				.pushText(get_life_experiences_counts(state)[0] >= MIN_LIFE_GREATNESS_COUNT ? 'yes ✅  ☀️' : '❌ not yet')
				.pushNode(render_life_fulfillment(state))
				.done()
		)

		.done()

	return $doc
}
