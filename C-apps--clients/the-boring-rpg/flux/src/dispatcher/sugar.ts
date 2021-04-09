import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { UUID } from '@offirmo-private/uuid'
import { CharacterClass } from '@tbrpg/state--character'
import { State } from '@tbrpg/state'
import {
	get_action_types,
	create_action__set,

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
	ActionSet,
	ActionHack,

	Action,
} from '@tbrpg/interfaces'

import { LIB } from '../consts'


const KNOWN_ACTIONS_COUNT = get_action_types().length

export function get_commands(
	dispatch: (action: Action) => void,
) {

	const commands = {
		play(time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionPlay = {
				time,
				type: ActionType.play,
				expected_revisions: {
					// no need for this one
				},
			}
			dispatch(action)
		},
		equip_item(target_uuid: UUID, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionEquipItem = {
				time,
				type: ActionType.equip_item,
				expected_revisions: {
					inventory: -1, // will be filled at a later stage
				},
				target_uuid,
			}
			dispatch(action)
		},
		sell_item(target_uuid: UUID, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionSellItem = {
				time,
				type: ActionType.sell_item,
				expected_revisions: {
					inventory: -1, // will be filled at a later stage
				},
				target_uuid,
			}
			dispatch(action)
		},
		rename_avatar(new_name: string, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionRenameAvatar = {
				time,
				type: ActionType.rename_avatar,
				expected_revisions: {
					avatar: -1, // will be filled at a later stage
				},
				new_name,
			}
			dispatch(action)
		},
		change_avatar_class(new_class: CharacterClass, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionChangeAvatarClass = {
				time,
				type: ActionType.change_avatar_class,
				expected_revisions: {
					avatar: -1, // will be filled at a later stage
				},
				new_class,
			}
			dispatch(action)
		},
		attempt_to_redeem_code(code: string, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionRedeemCode = {
				time,
				type: ActionType.redeem_code,
				expected_revisions: {},
				code,
			}
			dispatch(action)
		},

		start_game() { throw new Error(`[${LIB}] unexpected start_game !`)},
		on_start_session(is_web_diversity_supporter: boolean, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionStartSession = {
				time,
				type: ActionType.on_start_session,
				expected_revisions: {},
				is_web_diversity_supporter,
			}
			dispatch(action)
		},
		on_logged_in_refresh(is_logged_in: boolean, roles: string[] = [], time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionUpdateLoggedInInfos = {
				time,
				type: ActionType.on_logged_in_refresh,
				expected_revisions: {},
				is_logged_in,
				roles,
			}
			dispatch(action)
		},
		acknowledge_engagement_msg_seen(uid: number, time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionAcknowledgeEngagementMsgSeen = {
				time,
				type: ActionType.acknowledge_engagement_msg_seen,
				expected_revisions: {},
				uid,
			}
			dispatch(action)
		},
		update_to_now(time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionUpdateToNow = {
				time,
				type: ActionType.update_to_now,
				expected_revisions: {},
			}
			dispatch(action)
		},

		set(state: Immutable<State>) {
			dispatch(create_action__set(state))
		},
		custom(custom_reducer: ActionHack['custom_reducer'], time: TimestampUTCMs = get_UTC_timestamp_ms()) {
			const action: ActionHack = {
				time,
				type: ActionType.hack,
				expected_revisions: {},
				custom_reducer,
			}
			dispatch(action)
		},
	}

	if (Object.keys(commands).length !== KNOWN_ACTIONS_COUNT)
		throw new Error(`[${LIB}] commands are outdated!`)

	return commands
}
