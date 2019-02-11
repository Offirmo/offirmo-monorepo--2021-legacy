/////////////////////

import {expect} from 'chai'

import { createLogger } from '@offirmo/practical-logger-node'


import {LIB} from './consts'
import {get_lib_SEC} from './sec'
import { State, DEMO_STATE } from '@tbrpg/state'

import { create_game_instance } from '.'
import {getRootSEC} from "@offirmo/soft-execution-context";


/////////////////////


const logger = createLogger({
	name: LIB,
	level: 'info',
})

interface ViewState {

}


describe(`${LIB}`, function() {
	let state: State = DEMO_STATE
	let SEC = get_lib_SEC()
	let game_instance
	let get_latest_state = (): State => state
	let persist_state = (new_state: State) => { state = new_state}

	beforeEach(() => {
		state = DEMO_STATE
		SEC = get_lib_SEC()
			.injectDependencies({ logger })

		// the client is responsible for storing current state
		get_latest_state = () => state
		persist_state = (new_state: State) => {
			state = new_state
		}

		game_instance = create_game_instance<ViewState>({
			SEC,
			get_latest_state,
			persist_state,
			view_state: {},
		})
	})

	describe('init', function() {

		context('when passed no game (1)', function() {
			it('should create a new game', () => {
				state = (null as any)

				game_instance = create_game_instance<ViewState>({
					SEC,
					get_latest_state,
					persist_state,
					view_state: {},
				})

				expect(state).to.have.property('schema_version')
			})
		})

		context('when passed no game (2)', function() {
			it('should create a new game', () => {
				state = ({} as any)

				game_instance = create_game_instance<ViewState>({
					SEC,
					get_latest_state,
					persist_state,
					view_state: {},
				})

				expect(state).to.have.property('schema_version')
			})
		})

		context('when passed an existing game', function() {
			it('should automatically migrate to latest')
		})
	})

	describe('arch-state handling', function() {

	})

	describe('model storage', function() {

	})
})
