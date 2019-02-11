import React from 'react'

import { get_action_types } from '@tbrpg/flux'

/////////////////////

const ACTION_TYPE_TO_CTA = {
	'play': 'Play',
	'equip_item': 'Equip',
	'sell_item': 'Sell',
	'rename_avatar': 'Rename',
	'change_avatar_class': 'Change class',
	'redeem_code': 'Redeem code',
}
if (get_action_types().join(';') !== Object.keys(ACTION_TYPE_TO_CTA).join(';'))
	throw new Error('Internal error: ACTION_TYPE_TO_CTA needs an update!')

/////////////////////

const ActionButtonViewM = React.memo(
	function ActionButtonView({action, onClick}) {
		console.log('🔄 ActionButtonView')
		return (
			<button className={'tbrpg-action-btn'} onClick={onClick}>
				{ACTION_TYPE_TO_CTA[action.type]}
			</button>
		)
	}
)

export default ActionButtonViewM
