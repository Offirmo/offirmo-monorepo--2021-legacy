import { Immutable } from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'

import { State } from './types'
import { render as _render_flags } from '../state--flags/selectors--rich-text'
import { render as _render_guild_membership } from '../state--guild-membership/selectors--rich-text'
import { render as _render_relationship } from '../state--relationship/selectors--rich-text'


function render_flags(state: Immutable<State['flags']>, options?: {}): RichText.Document {
	const $doc = RichText.block_fragment()

		.pushHeading('Quests')
		.pushNode(_render_flags(state))

		.done()

	return $doc
}

function render_character(state: Immutable<State['character']>, options?: {}): RichText.Document {
	const level = state.level
	const expected_experience = (level + 1) * 1000
	const next_level_ratio = state.experience / expected_experience
	const power = (level + next_level_ratio) * 10

	const $doc = RichText.block_fragment()
		.pushHeading('Character')
		.pushNode(
			RichText.unordered_list()
				.pushKeyValue('Level', String(state.level))
				.pushKeyValue('XP', `${state.experience} / ${expected_experience}`)
				.pushKeyValue('Adventurers’ Guild', _render_guild_membership(state.guild, { mode: 'detailed' }))
				/*.pushNode(
					RichText.inline_fragment()
						.pushText('Adventurers’ Guild:')
						.pushNode(_render_guild_membership(state.guild))
						.done())*/
				//.pushKeyValue('Equipment', '✴️ TODO')
				//.pushKeyValue(RichText.strong().pushText('Overall character power').done(), power.toPrecision())
				.done()
		)

		.done()

	return $doc
}

function render_party__heroine(state: Immutable<State['npcs']['heroine']>, options?: {}): RichText.Document {
	const $doc = RichText.unordered_list()
		.pushNode(_render_guild_membership(state.guild))
		.pushNode(_render_relationship(state.relationship))
		.done()

	return $doc
}

function render_party(state: Immutable<State['npcs']>, options?: {}): RichText.Document {
	const $doc = RichText.block_fragment()

		.pushHeading('Party')

		.pushNode(
			RichText.unordered_list()
				.pushNode(
					RichText.inline_fragment()
						.pushText('Heroine')
						.pushNode(render_party__heroine(state.heroine))
						.done())
				//.pushKeyValue('Mount', '✴️ TODO')
				//.pushKeyValue('Pet', '✴️ TODO')
				//.pushKeyValue('Pet dragon', '✴️ TODO')
				//.pushKeyValue('Pet Slime(s)', '✴️ TODO')
				.pushKeyValue(RichText.strong().pushText('Overall party power').done(), '✴️ TODO')
				.done()
		)

		.done()

	return $doc
}


export function render(state: Immutable<State>, options?: {}): RichText.Document {
	const $doc = RichText.block_fragment()

		.pushNode(render_flags(state.flags))
		.pushHorizontalRule()

		.pushNode(render_character(state.character))
		.pushHorizontalRule()

		.pushNode(render_party(state.npcs))

		.done()

	return $doc
}
