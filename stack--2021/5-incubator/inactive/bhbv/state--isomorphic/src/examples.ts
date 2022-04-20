/////////////////////

import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

/////////////////////

import { StoryId, State, StoryState } from './types'
//import { cleanup } from './migrations'

/////////////////////

export const DEMO_STORY_STATE_01: Immutable<StoryState> = enforce_immutability<StoryState>({
	id: StoryId.lorem_ipsum,
	last_access_tms: 1605429372129,
	progress: 3,
})

/////////////////////

export const DEMO_STATE: Immutable<State> = enforce_immutability<State>(/*cleanup(get_lib_SEC(),*/ {
	schema_version: 1,
	revision: 5,
	stories: [
		DEMO_STORY_STATE_01,
	],
})
