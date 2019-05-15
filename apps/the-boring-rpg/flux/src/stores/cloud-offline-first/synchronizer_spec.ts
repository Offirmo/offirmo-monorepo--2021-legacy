/////////////////////

import { expect } from 'chai'
import sinon from 'sinon'
import { createLocalStorage } from 'localstorage-ponyfill'
import { createLogger } from '@offirmo-private/practical-logger-node'
import { getRootSEC } from '@offirmo-private/soft-execution-context'
import { State, DEMO_STATE, EngagementKey } from '@tbrpg/state'
import { StorageKey } from '@tbrpg/interfaces'
import * as TBRPGState from '@tbrpg/state'

import { LIB } from '../../consts'
import { get_lib_SEC } from '../../sec'
import create_in_mem_tbrpg_storage from '../../utils/in-mem-tbrpg-storage'

import { Synchronizer, create } from './synchonizer'

/////////////////////


describe.only(`${LIB} - cloud synchronizer`, function() {
	let local_storage = createLocalStorage({mode: "memory"})
	let storage = create_in_mem_tbrpg_storage()
	const logger = createLogger({
		name: LIB,
		suggestedLevel: 'log', // change here if bug
	})
	let SEC = get_lib_SEC()
	let out: Synchronizer = <any>null
	let call_remote_procedure = sinon.spy()
	let on_successful_sync = sinon.spy()

	beforeEach(() => {
		SEC = get_lib_SEC()
			.injectDependencies({logger})
		local_storage.clear()
		storage = create_in_mem_tbrpg_storage()
	})
	beforeEach(function () {
		this.clock = sinon.useFakeTimers(100_000)
	})
	afterEach(function () {
		this.clock.restore()
	})

	describe('init', function () {

		it('should initiate a sync', function() {
			const out = create({
				SEC,
				call_remote_procedure,
				on_successful_sync,
				initial_state: TBRPGState.create(SEC),
				initial_pending_actions: []
			})

			expect(call_remote_procedure).to.have.been.calledOnce


		})
	})
})
