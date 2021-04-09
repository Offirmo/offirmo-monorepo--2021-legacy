import { Immutable } from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'
import { State as CharacterState, CharacterAttribute, CHARACTER_ATTRIBUTES_SORTED } from '@tbrpg/state--character'

function render_avatar(state: Immutable<CharacterState>): RichText.Document {
	const $doc_name = RichText.inline_fragment().addClass('avatar__name').pushText(state.name).done()
	const $doc_class = RichText.inline_fragment().addClass('avatar__class').pushText(state.klass).done()

	const $doc = RichText.block_fragment()
		.pushHeading('Identity:', {id: 'header'})
		.pushNode(
			RichText.unordered_list()
				.pushKeyValue('name', $doc_name)
				.pushKeyValue('class', $doc_class)
				.done(),
		)
		.done()

	return $doc
}

function render_attributes(state: Immutable<CharacterState>): RichText.Document {
	const $doc_list = RichText.unordered_list()
		.addClass('attributes')
		.done()

	CHARACTER_ATTRIBUTES_SORTED.forEach((stat: CharacterAttribute, index: number) => {
		const label = stat
		const value = state.attributes[stat]

		const $doc_attr = RichText.key_value(label, `${value}`).done()

		$doc_list.$sub[`000${index}`.slice(-3)] = $doc_attr
	})

	const $doc = RichText.block_fragment()
		.pushNode(RichText.heading().pushText('Attributes:').done(), {id: 'header'})
		.pushNode($doc_list, {id: 'list'})
		.done()

	return $doc
}

function render_character_sheet(state: Immutable<CharacterState>): RichText.Document {
	const $doc = RichText.block_fragment()
		.pushNode(render_avatar(state), {id: 'avatar'})
		.pushNode(render_attributes(state), {id: 'attributes'})
		.done()

	return $doc
}

export {
	render_avatar,
	render_attributes,
	render_character_sheet,
}
