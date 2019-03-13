import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo/timestamps'
import { UUID } from '@offirmo/uuid'
import { CharacterClass } from '@oh-my-rpg/state-character'
import { State } from '@tbrpg/state'

import {
	ActionType,

	ActionStartSession,
	ActionPlay,
	ActionEquipItem,
	ActionSellItem,
	ActionRenameAvatar,
	ActionChangeAvatarClass,
	ActionRedeemCode,
	ActionAcknowledgeEngagementMsgSeen,
	ActionUpdateToNow,
	ActionHack,

	Action,
} from '../actions'

function get_commands(
	dispatch: (action: Action) => void
) {
	return {
		on_start_session(is_web_diversity_supporter: boolean, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionStartSession = {
				time,
				type: ActionType.on_start_session,
				is_web_diversity_supporter,
			}
			dispatch(action)
		},
		play(time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionPlay = {
				time,
				type: ActionType.play,
			}
			dispatch(action)
		},
		equip_item(target_uuid: UUID, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionEquipItem = {
				time,
				type: ActionType.equip_item,
				target_uuid
			}
			dispatch(action)
		},
		sell_item(target_uuid: UUID, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionSellItem = {
				time,
				type: ActionType.sell_item,
				target_uuid,
			}
			dispatch(action)
		},
		rename_avatar(new_name: string, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionRenameAvatar = {
				time,
				type: ActionType.rename_avatar,
				new_name,
			}
			dispatch(action)
		},
		change_avatar_class(new_class: CharacterClass, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionChangeAvatarClass = {
				time,
				type: ActionType.change_avatar_class,
				new_class,
			}
			dispatch(action)
		},
		attempt_to_redeem_code(code: string, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionRedeemCode = {
				time,
				type: ActionType.redeem_code,
				code,
			}
			dispatch(action)
		},
		acknowledge_engagement_msg_seen(uid: number, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionAcknowledgeEngagementMsgSeen = {
				time,
				type: ActionType.acknowledge_engagement_msg_seen,
				uid,
			}
			dispatch(action)
		},
		update_to_now(time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionUpdateToNow = {
				time,
				type: ActionType.update_to_now,
			}
			dispatch(action)
		},
		custom(custom_reducer: (state: Readonly<State>) => Readonly<State>, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionHack = {
				time,
				type: ActionType.hack,
				custom_reducer,
			}
			dispatch(action)
		},
	}
}

export {
	get_commands,
}
