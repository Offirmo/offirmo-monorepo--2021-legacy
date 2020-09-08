/////////////////////

import { expect } from 'chai'
import sinon from 'sinon'
import { createLocalStorage } from 'localstorage-ponyfill'
import { createLogger } from '@offirmo/practical-logger-node'
import { State, DEMO_STATE, EngagementKey } from '@tbrpg/state'
import { StorageKey } from '@tbrpg/interfaces'

import { LIB } from './consts'
import { get_lib_SEC } from './sec'
import { create_game_instance } from '.'
import create_in_mem_tbrpg_storage from './utils/in-mem-tbrpg-storage'

/////////////////////

interface AppState {
	model: State
}

describe(`${LIB} - game-instance`, function() {

	const local_storage = createLocalStorage({ mode : 'memory' })
	let storage = create_in_mem_tbrpg_storage()
	const logger = createLogger({
		name: LIB,
		suggestedLevel: 'log', // change here if bug
	})
	let SEC = get_lib_SEC()
	const START_MS = 100_000

	beforeEach(() => {
		SEC = get_lib_SEC()
			.injectDependencies({ logger })
		local_storage.clear()
		storage = create_in_mem_tbrpg_storage()
	})
	beforeEach(function () {
		this.clock = sinon.useFakeTimers(START_MS)
	})
	afterEach(function () {
		this.clock.restore()
	})

	describe('init', function() {

		context('when passed no game (undefined)', function() {
			it('should create a new game', () => {
				const game_instance = create_game_instance<AppState>({
					SEC,
					local_storage,
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
					local_storage,
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
					local_storage,
					storage,
					app_state: {} as any,
				})

				const model = game_instance.model.get()
				expect(model).to.have.property('schema_version')

				expect(model.u_state.avatar.name).to.equal('PerteProd')
				expect(model.u_state.avatar.klass).to.equal('knight')
				expect(model.u_state.progress.statistics.good_play_count).to.equal(1028)
				expect(model.u_state.progress.statistics.bad_play_count).to.equal(93)
			})
		})
	})

	describe('event emitter', function() {
		// TODO
	})

	describe('arch-state handling', function() {

		describe('basic use', function() {

			it('should work properly', function() {
				const game_instance = create_game_instance<AppState>({
					SEC,
					local_storage,
					storage,
					app_state: {} as any,
				})

				game_instance.commands.on_start_session(false)
				this.clock.tick(500)
				game_instance.commands.on_logged_in_refresh(false)

				this.clock.tick(1_500)
				game_instance.commands.play()
				expect(game_instance.model.get().u_state.last_user_action_tms).to.equal(START_MS + 2_000)

				this.clock.tick(2_000)
				game_instance.commands.play()
				expect(game_instance.model.get().u_state.last_user_action_tms).to.equal(START_MS + 4_000)

				this.clock.tick(10_000)
				game_instance.commands.rename_avatar('Test')
				expect(game_instance.model.get().u_state.last_user_action_tms).to.equal(START_MS + 14_000)

				this.clock.tick(5_000)
				game_instance.commands.change_avatar_class('warrior')
				expect(game_instance.model.get().u_state.last_user_action_tms).to.equal(START_MS + 19_000)

				expect(game_instance.model.get().u_state.avatar.name).to.equal('Test')
				expect(game_instance.queries.get_sub_state('avatar').name).to.equal('Test')

				expect(game_instance.queries.get_sub_state('avatar').klass).to.equal('warrior')
			})
		})

		describe('basic mistakes', function() {

			it('should throw properly', function() {
				let elapsed_ms = START_MS
				const game_instance = create_game_instance<AppState>({
					SEC,
					local_storage,
					storage,
					app_state: {} as any,
				})

				game_instance.commands.on_start_session(false)
				this.clock.tick(500)
				elapsed_ms += 500
				game_instance.commands.on_logged_in_refresh(false)

				this.clock.tick(1_500)
				elapsed_ms += 1_500
				game_instance.commands.play()

				this.clock.tick(2_000)
				elapsed_ms += 2_000
				game_instance.commands.play()
				this.clock.tick(1_000)
				elapsed_ms += 1_000
				game_instance.commands.play()
				this.clock.tick(1_000)
				elapsed_ms += 1_000
				game_instance.commands.play()
				this.clock.tick(1_000)
				elapsed_ms += 1_000
				game_instance.commands.play()
				this.clock.tick(1_000)
				elapsed_ms += 1_000
				game_instance.commands.play()
				this.clock.tick(1_000)
				elapsed_ms += 1_000
				game_instance.commands.play()
				expect(game_instance.queries.get_sub_state('progress').statistics.good_play_count, 'play count 1g').to.equal(7)
				expect(game_instance.queries.get_sub_state('progress').statistics.bad_play_count, 'play count 1b').to.equal(0)

				// bad play
				// finish empty the fill due to onboarding
				game_instance.commands.play()
				game_instance.commands.play()
				game_instance.commands.play()
				game_instance.commands.play()
				game_instance.commands.play()
				//game_instance.commands.play()
				expect(game_instance.model.get().u_state.last_user_action_tms).to.equal(elapsed_ms)
				expect(game_instance.queries.get_sub_state('progress').statistics.bad_play_count, 'play count 2b').to.equal(0)
				expect(game_instance.queries.get_sub_state('progress').statistics.good_play_count, 'play count 2g').to.equal(12)

				game_instance.commands.play()
				expect(game_instance.queries.get_sub_state('progress').statistics.good_play_count, 'play count 3g').to.equal(12)
				expect(game_instance.queries.get_sub_state('progress').statistics.bad_play_count, 'play count 3d').to.equal(1)

				// bad misc
				this.clock.tick(1_000)
				elapsed_ms += 1_000
				expect(() => game_instance.commands.rename_avatar('')).to.throw('renaming') // forbidden, shouldn't be possible
				this.clock.tick(1_000)
				elapsed_ms += 1_000
				expect(() => game_instance.commands.change_avatar_class('novice')).to.throw('switch class') // forbidden, shouldn't be possible

				// bad code redeem
				this.clock.tick(1_000)
				elapsed_ms += 1_000
				game_instance.commands.attempt_to_redeem_code('alphatwink')
				let notif = game_instance.queries.get_sub_state('engagement').queue.slice(-1)[0]
				expect(notif).to.have.nested.property('engagement.type', 'flow')
				expect(notif).to.have.nested.property('engagement.key', EngagementKey['code_redemption--succeeded'])

				this.clock.tick(1_000)
				elapsed_ms += 1_000
				game_instance.commands.attempt_to_redeem_code('alphatwink')
				notif = game_instance.queries.get_sub_state('engagement').queue.slice(-1)[0]
				expect(notif).to.have.nested.property('engagement.type', 'flow')
				expect(notif).to.have.nested.property('engagement.key', EngagementKey['code_redemption--failed'])
			})
		})

		describe('standard new user journey with eventual login', function() {

			it('should work properly', function() {
				const game_instance = create_game_instance<AppState>({
					SEC,
					local_storage,
					storage,
					app_state: {} as any,
				})

				game_instance.commands.on_start_session(false)
				this.clock.tick(500)
				game_instance.commands.on_logged_in_refresh(false)

				this.clock.tick(1_500)
				game_instance.commands.play()
				expect(game_instance.model.get().u_state.last_user_action_tms).to.equal(START_MS + 2_000)

				this.clock.tick(2_000)
				game_instance.commands.play()
				expect(game_instance.model.get().u_state.last_user_action_tms).to.equal(START_MS + 4_000)

				this.clock.tick(10_000)
				game_instance.commands.rename_avatar('Test')
				expect(game_instance.model.get().u_state.last_user_action_tms).to.equal(START_MS + 14_000)

				this.clock.tick(5_000)
				game_instance.commands.change_avatar_class('warrior')
				expect(game_instance.model.get().u_state.last_user_action_tms).to.equal(START_MS + 19_000)

				// wooo the user likes it!
				this.clock.tick(5_000)
				game_instance.commands.on_logged_in_refresh(true)

				this.clock.tick(1_000)
				game_instance.commands.play()

				// TODO test more
			})
		})
	})
})
