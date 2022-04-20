import { Enum } from 'typescript-string-enums'

import { TimestampUTCMs } from '@offirmo-private/timestamps'
import {
	BaseState,
} from '@offirmo-private/state-utils'

/////////////////////

// tslint:disable-next-line: variable-name
export const StoryId = Enum(
	'lorem_ipsum',
)
export type StoryId = Enum<typeof StoryId> // eslint-disable-line no-redeclare

/////////////////////

export interface StoryState {
	id: StoryId
	last_access_tms: TimestampUTCMs
	progress: number
}

/////////////////////

export interface State extends BaseState {
	stories: StoryState[]
}

/////////////////////

