/////////////////////

import {expect} from 'chai'

import { createLogger } from '@offirmo/practical-logger-node'


import {LIB} from './consts'
import {get_lib_SEC} from './sec'
import { State, DEMO_STATE } from '@tbrpg/state'

import { create_game_instance } from '.'
import {getRootSEC} from "@offirmo/soft-execution-context";


/////////////////////




interface AppState {
	model: State
}


describe(`${LIB}`, function() {
	const logger = createLogger({
		name: LIB,
		suggestedLevel: 'info',
	})
	let SEC = get_lib_SEC()

	beforeEach(() => {
		SEC = get_lib_SEC()
			.injectDependencies({ logger })
	})

	describe('init', function() {

		context('when passed no game (1)', function() {
			it('should create a new game', () => {
				const game_instance = create_game_instance<AppState>({
					SEC,
					app_state: {} as any,
				})

				expect(game_instance.model.get()).to.have.property('schema_version')
			})
		})

		context('when passed no game (2)', function() {
			it('should create a new game', () => {
				const game_instance = create_game_instance<AppState>({
					SEC,
					app_state: { model: {} as any },
				})

				expect(game_instance.model.get()).to.have.property('schema_version')
			})
		})

		context('when passed an existing game', function() {
			it('should automatically migrate to latest')
		})
	})

	describe('arch-state handling', function() {

	})

	describe('model in-memory storage', function() {

	})
})
