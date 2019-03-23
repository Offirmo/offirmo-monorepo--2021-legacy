import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo/timestamps'
import { UUID } from '@offirmo/uuid'
import { CharacterClass } from '@oh-my-rpg/state-character'
import { State } from '@tbrpg/state'
import {
	ACTIONS_SCHEMA_VERSION,
	ActionType,

	ActionStartSession,
	ActionUpdateLoggedInInfos,
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
} from '@tbrpg/interfaces'

import { LIB } from '../consts'


const KNOWN_ACTIONS = 12

function get_commands(
	dispatch: (action: Action) => void
) {

	const commands = {
		play(time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionPlay = {
				v: ACTIONS_SCHEMA_VERSION,
				time,
				type: ActionType.play,
				expected_sub_state_revisions: {
					// no need for this one
				},
			}
			dispatch(action)
		},
		equip_item(target_uuid: UUID, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionEquipItem = {
				v: ACTIONS_SCHEMA_VERSION,
				time,
				type: ActionType.equip_item,
				expected_sub_state_revisions: {
					inventory: -1, // will be filled at a later stage
				},
				target_uuid
			}
			dispatch(action)
		},
		sell_item(target_uuid: UUID, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionSellItem = {
				v: ACTIONS_SCHEMA_VERSION,
				time,
				type: ActionType.sell_item,
				expected_sub_state_revisions: {
					inventory: -1, // will be filled at a later stage
				},
				target_uuid,
			}
			dispatch(action)
		},
		rename_avatar(new_name: string, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionRenameAvatar = {
				v: ACTIONS_SCHEMA_VERSION,
				time,
				type: ActionType.rename_avatar,
				expected_sub_state_revisions: {
					avatar: -1, // will be filled at a later stage
				},
				new_name,
			}
			dispatch(action)
		},
		change_avatar_class(new_class: CharacterClass, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionChangeAvatarClass = {
				v: ACTIONS_SCHEMA_VERSION,
				time,
				type: ActionType.change_avatar_class,
				expected_sub_state_revisions: {
					avatar: -1, // will be filled at a later stage
				},
				new_class,
			}
			dispatch(action)
		},
		attempt_to_redeem_code(code: string, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionRedeemCode = {
				v: ACTIONS_SCHEMA_VERSION,
				time,
				type: ActionType.redeem_code,
				expected_sub_state_revisions: {},
				code,
			}
			dispatch(action)
		},

		start_game() { throw new Error(`${LIB}: unexpected command !`)},
		on_start_session(is_web_diversity_supporter: boolean, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionStartSession = {
				v: ACTIONS_SCHEMA_VERSION,
				time,
				type: ActionType.on_start_session,
				expected_sub_state_revisions: {},
				is_web_diversity_supporter,
			}
			dispatch(action)
		},
		on_logged_in_update(is_logged_in: boolean, roles: string[], time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionUpdateLoggedInInfos = {
				v: ACTIONS_SCHEMA_VERSION,
				time,
				type: ActionType.on_logged_in_update,
				expected_sub_state_revisions: {},
				is_logged_in,
				roles,
			}
			dispatch(action)
		},
		acknowledge_engagement_msg_seen(uid: number, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionAcknowledgeEngagementMsgSeen = {
				v: ACTIONS_SCHEMA_VERSION,
				time,
				type: ActionType.acknowledge_engagement_msg_seen,
				expected_sub_state_revisions: {},
				uid,
			}
			dispatch(action)
		},
		update_to_now(time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionUpdateToNow = {
				v: ACTIONS_SCHEMA_VERSION,
				time,
				type: ActionType.update_to_now,
				expected_sub_state_revisions: {},
			}
			dispatch(action)
		},
		custom(custom_reducer: (state: Readonly<State>) => Readonly<State>, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionHack = {
				v: ACTIONS_SCHEMA_VERSION,
				time,
				type: ActionType.hack,
				expected_sub_state_revisions: {},
				custom_reducer,
			}
			dispatch(action)
		},
	}

	if (Object.keys(commands).length !== KNOWN_ACTIONS)
		throw new Error(`${LIB}: commands are outdated!`)

	return commands
}

export {
	get_commands,
}
