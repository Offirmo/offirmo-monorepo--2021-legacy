/////////////////////

import { expect } from 'chai'
import { createLocalStorage } from 'localstorage-ponyfill'
import { createLogger } from '@offirmo/practical-logger-node'
import { getRootSEC } from '@offirmo/soft-execution-context'

import { State, DEMO_STATE } from '@tbrpg/state'

import { LIB } from './consts'
import { get_lib_SEC } from './sec'
import { LS_KEYS } from './stores/consts'
import { create_game_instance } from '.'


/////////////////////

interface AppState {
	model: State
}

describe(`${LIB}`, function() {
	const local_storage = createLocalStorage({ mode : "memory" })
	const logger = createLogger({
		name: LIB,
		suggestedLevel: 'trace',
	})
	let SEC = get_lib_SEC()

	beforeEach(() => {
		SEC = get_lib_SEC()
			.injectDependencies({ logger })
		local_storage.clear()
	})

	describe('init', function() {

		context('when passed no game (undefined)', function() {
			it('should create a new game', () => {
				const game_instance = create_game_instance<AppState>({
					SEC,
					local_storage,
					app_state: {} as any,
				})

				expect(game_instance.model.get()).to.have.property('schema_version')
			})
		})

		context('when passed no game ({})', function() {
			it('should create a new game', () => {
				local_storage.setItem(LS_KEYS.savegame, '{}')
				const game_instance = create_game_instance<AppState>({
					SEC,
					local_storage,
					app_state: {} as any,
				})

				expect(game_instance.model.get()).to.have.property('schema_version')
			})
		})

		context('when passed an existing game', function() {
			it('should use it and automatically migrate to latest', () => {
				local_storage.setItem(LS_KEYS.savegame, JSON.stringify(DEMO_STATE))
				const game_instance = create_game_instance<AppState>({
					SEC,
					local_storage,
					app_state: {} as any,
				})

				const model = game_instance.model.get()
				expect(model).to.have.property('schema_version')

				expect(model.u_state.avatar.name).to.equal('Perte')
				expect(model.u_state.avatar.klass).to.equal("paladin")
				expect(model.u_state.progress.statistics.good_play_count).to.equal(12)
				expect(model.u_state.progress.statistics.bad_play_count).to.equal(3)
			})
		})
	})

	describe('arch-state handling', function() {

	})
})
