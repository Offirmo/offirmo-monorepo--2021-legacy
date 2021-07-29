import { Immutable } from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'

import { Quality } from '../type--quality/types'
import { get_class__quality } from '../type--quality/selectors--rich-text'
import { RelationshipLevel } from './types'
import { get_corresponding_quality } from './selectors'



const TO_TEXT = {
	[RelationshipLevel.strangers]: 'strangers',
	[RelationshipLevel.introduced]: 'introduced',
	[RelationshipLevel.acquaintances]: 'acquaintances',
	[RelationshipLevel.friends]: 'friends',
	[RelationshipLevel.friendsⵧgood]: 'good friends',
	[RelationshipLevel.friendsⵧbest]: 'best friends 💚',
	[RelationshipLevel.dating]: 'dating 💙',
	[RelationshipLevel.intimateⵧ1]: '1st base 💙',
	[RelationshipLevel.intimateⵧ2]: '2nd base 💜💜',
	[RelationshipLevel.intimateⵧ3]: '3rd base 🧡🧡🧡',
}
export function render(level: Immutable<RelationshipLevel>): RichText.Document {
	const $doc = RichText.inline_fragment()
		.addClass(get_class__quality(get_corresponding_quality(level)))
		.pushText(TO_TEXT[level])
		.done()

	return $doc
}
