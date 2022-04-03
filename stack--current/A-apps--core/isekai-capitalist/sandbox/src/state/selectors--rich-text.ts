import { Immutable } from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'

import { render as _render_flags } from '../state--flags/selectors--rich-text'
import { render as _render_guild_membership } from '../state--guild-membership/selectors--rich-text'
import { render as _render_relationship } from '../state--relationship/selectors--rich-text'

import { State } from './types'
import {
	get_mc_overall_power,
	get_party_overall_power,
	get_required_xp_for_next_level,
} from './selectors'
import * as RelationshipLevelLib from '../type--relationship-level'

function render_flags(state: Immutable<State['flags']>, options?: {}): RichText.Document {
	const $doc = RichText.block_fragment()

		.pushHeading('Quests')
		.pushNode(_render_flags(state))

		.done()

	return $doc
}

function render_mc(state: Immutable<State>, options?: {}): RichText.Document {
	const { level, xp } = state.mc
	const required_xp = get_required_xp_for_next_level(level)

	const $doc = RichText.block_fragment()
		.pushHeading('Main character')
		.pushNode(
			RichText.unordered_list()
				.pushKeyValue('Level', String(level))
				.pushKeyValue('XP', `${xp} / ${required_xp}`)
				.pushKeyValue('Adventurers’ Guild', _render_guild_membership(state.mc.guild, { mode: 'detailed' }))
				//.pushKeyValue('Equipment', '✴️ TODO')
				.pushKeyValue(RichText.strong().pushText('Overall character power').done(), get_mc_overall_power(state).toFixed())
				.done()
		)

		.done()

	return $doc
}

function render_party__heroine(state: Immutable<State['npcs']['heroine']>, options?: {}): RichText.Document {
	if (state.relationship.level === RelationshipLevelLib.RelationshipLevel.strangers)
		return RichText.unordered_list().pushKeyValue('???', '(not met yet)').done()

	const $doc = RichText.unordered_list()
		.pushNode(_render_relationship(state.relationship))
		.pushNode(_render_guild_membership(state.guild))
		.done()

	return $doc
}

function render_party(state: Immutable<State>, options?: {}): RichText.Document {
	const $doc = RichText.block_fragment()

		.pushHeading('Party')

		.pushNode(
			RichText.unordered_list()
				.pushKeyValue('Heroine', render_party__heroine(state.npcs.heroine))
				//.pushKeyValue('Mount', '✴️ TODO')
				//.pushKeyValue('Pet', '✴️ TODO')
				//.pushKeyValue('Pet dragon', '✴️ TODO')
				//.pushKeyValue('Pet Slime(s)', '✴️ TODO')
				.pushKeyValue(RichText.strong().pushText('Overall party power').done(), get_party_overall_power(state).toFixed())
				.done()
		)

		.done()

	return $doc
}


export function render(state: Immutable<State>, options?: {}): RichText.Document {
	const $doc = RichText.block_fragment()

		.pushNode(render_flags(state.flags))
		.pushHorizontalRule()

		.pushNode(render_mc(state))
		.pushHorizontalRule()

		.pushNode(render_party(state))

		.done()

	return $doc
}
