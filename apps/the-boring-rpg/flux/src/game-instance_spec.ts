/////////////////////

import { expect } from 'chai'
import { createLocalStorage } from 'localstorage-ponyfill'
import { createLogger } from '@offirmo/practical-logger-node'
import { getRootSEC } from '@offirmo/soft-execution-context'
import { State, DEMO_STATE } from '@tbrpg/state'
import { StorageKey } from '@tbrpg/interfaces'

import { LIB } from './consts'
import { get_lib_SEC } from './sec'
import { create_game_instance } from '.'
import create_in_mem_tbrpg_storage from './utils/in-mem-tbrpg-storage'

/////////////////////

interface AppState {
	model: State
}

describe(`${LIB}`, function() {
	let storage = create_in_mem_tbrpg_storage()
	const logger = createLogger({
		name: LIB,
		suggestedLevel: 'trace',
	})
	let SEC = get_lib_SEC()

	beforeEach(() => {
		SEC = get_lib_SEC()
			.injectDependencies({ logger })
		storage = create_in_mem_tbrpg_storage()
	})

	describe('init', function() {

		context('when passed no game (undefined)', function() {
			it('should create a new game', () => {
				const game_instance = create_game_instance<AppState>({
					SEC,
					storage,
					app_state: {} as any,
				})

				expect(game_instance.model.get()).to.have.property('schema_version')
			})
		})

		context('when passed no game ({})', function() {
			it('should create a new game', () => {
				storage.set_item(StorageKey.savegame, '{}')
				const game_instance = create_game_instance<AppState>({
					SEC,
					storage,
					app_state: {} as any,
				})

				expect(game_instance.model.get()).to.have.property('schema_version')
			})
		})

		context('when passed an existing game', function() {
			it('should use it and automatically migrate to latest', () => {
				storage.set_item(StorageKey.savegame, JSON.stringify(DEMO_STATE))
				const game_instance = create_game_instance<AppState>({
					SEC,
					storage,
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
		// TODO
	})
})
