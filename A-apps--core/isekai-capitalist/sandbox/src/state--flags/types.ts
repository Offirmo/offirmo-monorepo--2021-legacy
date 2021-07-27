import { BaseState } from '@offirmo-private/state-utils'
import { has_lived_to_the_fullest } from './selectors'

export interface State extends BaseState {
	has_saved_the_world: boolean
	has_lived_to_the_fullest: boolean
	has_found_their_soulmate: boolean
	has_improved_civilization: boolean
}
