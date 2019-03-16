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
				type: ActionType.on_start_session,
				time,
				expected_sub_state_revisions: {},
				is_web_diversity_supporter,
			}
			dispatch(action)
		},
		play(time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionPlay = {
				time,
				expected_sub_state_revisions: {},
				type: ActionType.play,
			}
			dispatch(action)
		},
		equip_item(target_uuid: UUID, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionEquipItem = {
				time,
				expected_sub_state_revisions: {},
				type: ActionType.equip_item,
				target_uuid
			}
			dispatch(action)
		},
		sell_item(target_uuid: UUID, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionSellItem = {
				type: ActionType.sell_item,
				time,
				expected_sub_state_revisions: {},
				target_uuid,
			}
			dispatch(action)
		},
		rename_avatar(new_name: string, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionRenameAvatar = {
				type: ActionType.rename_avatar,
				time,
				expected_sub_state_revisions: {},
				new_name,
			}
			dispatch(action)
		},
		change_avatar_class(new_class: CharacterClass, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionChangeAvatarClass = {
				type: ActionType.change_avatar_class,
				time,
				expected_sub_state_revisions: {},
				new_class,
			}
			dispatch(action)
		},
		attempt_to_redeem_code(code: string, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionRedeemCode = {
				type: ActionType.redeem_code,
				time,
				expected_sub_state_revisions: {},
				code,
			}
			dispatch(action)
		},
		acknowledge_engagement_msg_seen(uid: number, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionAcknowledgeEngagementMsgSeen = {
				type: ActionType.acknowledge_engagement_msg_seen,
				time,
				expected_sub_state_revisions: {},
				uid,
			}
			dispatch(action)
		},
		update_to_now(time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionUpdateToNow = {
				type: ActionType.update_to_now,
				time,
				expected_sub_state_revisions: {},
			}
			dispatch(action)
		},
		custom(custom_reducer: (state: Readonly<State>) => Readonly<State>, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionHack = {
				type: ActionType.hack,
				time,
				expected_sub_state_revisions: {},
				custom_reducer,
			}
			dispatch(action)
		},
	}
}

export {
	get_commands,
}
