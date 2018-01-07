import * as RichText from '@oh-my-rpg/rich-text-format'
import { State as CharacterState, CharacterAttribute, CHARACTER_ATTRIBUTES_SORTED } from '@oh-my-rpg/state-character'


function render_avatar(state: CharacterState): RichText.Document {
	// TODO refactor
	const $doc = RichText.section()
		.pushText('name:  {{name}}{{br}}')
		.pushText('class: {{class}}')
		.pushRawNode(
			RichText.span().addClass('avatar__name').pushText(state.name).done(),
			'name'
		)
		.pushRawNode(
			RichText.span().addClass('avatar__class').pushText(state.klass).done(),
			'class'
		)
		.done()

	return $doc
}

function render_attributes(state: CharacterState): RichText.Document {
	const $doc_list = RichText.unordered_list()
		.addClass('attributes')
		.done()

	// TODO better sort
	CHARACTER_ATTRIBUTES_SORTED.forEach((stat: CharacterAttribute, index: number) => {
		const label = stat
		const value = state.attributes[stat]

		const padded_label = `${label}............`.slice(0, 11)
		const padded_human_value = `.......${value}`.slice(-4)

		const $doc_item = RichText.span()
			.addClass('attribute--' + stat)
			.pushText(padded_label + padded_human_value)
			.done()
		$doc_list.$sub['' + index] = $doc_item
	})

	const $doc = RichText.section()
		.pushNode(RichText.heading().pushText('Attributes:').done(), 'header')
		.pushNode($doc_list, 'list')
		.done()

	return $doc
}


function render_character_sheet(state: CharacterState): RichText.Document {
	const $doc = RichText.section()
		.pushNode(render_avatar(state), 'avatar')
		.pushLineBreak()
		.pushNode(render_attributes(state), 'attributes')
		.done()

	return $doc
}

export {
	render_avatar,
	render_attributes,
	render_character_sheet,
}
