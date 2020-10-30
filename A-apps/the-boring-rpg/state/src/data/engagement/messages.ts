import { Immutable} from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'
import { PendingEngagement } from '@oh-my-rpg/state-engagement'
import { EngagementKey } from './types'

////////////////////////////////////

export function get_engagement_message(pe: Immutable<PendingEngagement>): RichText.Document {
	const { engagement: {key}, params} = pe

	switch(key) {
		case EngagementKey['just-some-text']:
			return RichText.block_fragment()
				.pushText(params.text)
				.done()

		case EngagementKey['hello_world--flow']:
		case EngagementKey['hello_world--aside']:
		case EngagementKey['hello_world--warning']:
			return RichText.block_fragment()
				.pushText('[TEST] Hello, ')
				.pushInlineFragment(params.name || 'world', {id: 'name'})
				.pushText('!')
				.done()

		case EngagementKey['tip--first_play']:
			return RichText.block_fragment()
				.pushStrong('Tip: ')
				.pushText('Select ')
				.pushStrong('play')
				.pushText(' to start adventuring!')
				.done()

		case EngagementKey['code_redemption--failed']:
			return RichText.block_fragment()
				.pushStrong('Error: This code is either non-existing or non redeemable at the moment.')
				.done()

		case EngagementKey['code_redemption--succeeded']:
			return RichText.block_fragment()
				.pushWeak('Code successfully redeemed.')
				.done()

		case EngagementKey['achievement-unlocked']:
			return RichText.block_fragment()
				.pushStrong('🏆 Achievement unlocked:')
				.pushLineBreak()
				.pushText(`“${params.icon} ${params.name}“`)
				.done()

		case EngagementKey['reborn']:
			return RichText.block_fragment()
				.pushStrong('You got reborn')
				.pushLineBreak()
				.pushText('Sorry, I changed the data format 😰.')
				.done()

		default:
			throw new Error(`Missing engagement message for "${key}"! (not implemented?)`)
	}
}
