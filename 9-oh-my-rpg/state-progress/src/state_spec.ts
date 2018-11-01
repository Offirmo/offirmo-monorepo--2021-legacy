import deepFreeze from "deep-freeze-strict"
import { expect } from 'chai'

import { SCHEMA_VERSION } from './consts'
import {
	State,
	create,
} from '.'
import { get_lib_SEC } from './sec'

describe('@oh-my-rpg/state-progress - reducer', function() {

	describe('🆕  initial state', function() {

		it('should have correct defaults', function() {
			const state = create(get_lib_SEC())
			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				flags: null,

				achievements: null,

				statistics: {
					good_play_count: 0,
					bad_play_count: 0,
					encountered_adventures: {},
					encountered_monsters: {},
					good_play_count_by_active_class: {},
					bad_play_count_by_active_class: {},
					has_account: false,
					is_registered_alpha_player: false,
				}
			})
		})
	})

})
