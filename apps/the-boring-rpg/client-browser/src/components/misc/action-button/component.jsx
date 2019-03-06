import React from 'react'

import { get_action_types } from '@tbrpg/flux'

/////////////////////

const INTERNAL = 'xxx'
const ACTION_TYPE_TO_CTA = {
	'play': 'Play',
	'equip_item': 'Equip',
	'sell_item': 'Sell',
	'rename_avatar': 'Rename',
	'change_avatar_class': 'Change class',
	'redeem_code': 'Redeem code',

	'start_game': INTERNAL,
	'on_start_session': INTERNAL,
	'acknowledge_engagement_msg_seen': INTERNAL,
	'update_to_now': INTERNAL,
	'hack': INTERNAL,
}
if (get_action_types().sort().join(';') !== Object.keys(ACTION_TYPE_TO_CTA).sort().join(';')) {
	throw new Error('Internal error: ACTION_TYPE_TO_CTA needs an update!')
}

/////////////////////

const ActionButtonViewM = React.memo(
	function ActionButtonView({action, onClick}) {
		console.log('🔄 ActionButtonView')
		const cta = ACTION_TYPE_TO_CTA[action.type]
		if (cta === INTERNAL)
			throw new Error(`UI can't display an internal action!`)
		return (
			<button className={'tbrpg-action-btn'} onClick={onClick}>
				{cta}
			</button>
		)
	}
)

export default ActionButtonViewM
