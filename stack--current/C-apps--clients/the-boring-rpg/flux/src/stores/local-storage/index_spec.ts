/////////////////////

import { expect } from 'chai'
import sinon from 'sinon'
import { enforce_immutability } from '@offirmo-private/state-utils'
import stable_stringify from 'json-stable-stringify'
import { createLocalStorage } from 'localstorage-ponyfill'
import { createLogger } from '@offirmo/practical-logger-node'
import { get_schema_version_loose, WithRevision, WithSchemaVersion } from '@offirmo-private/state-utils'
import { State, DEMO_STATE, SCHEMA_VERSION, migrate_to_latest } from '@tbrpg/state'
import { create_action_noop } from '@tbrpg/interfaces'
import { end_of_current_event_loop, all_planned_idle_executed } from '@offirmo-private/async-utils'

import { LIB } from '../../consts'
import { get_lib_SEC } from '../../sec'

import { create, StorageKey } from '.'

/////////////////////

function storage_to_string(storage: ReturnType<typeof createLocalStorage>): string {
	return Array.from(storage)
		.map((v, i) => storage.key(i))
		.toString()
}


describe(`${LIB} - store - local storage`, function() {
	const local_storage = createLocalStorage({ mode : 'memory' })
	const logger = createLogger({
		name: LIB,
		suggestedLevel: 'silly', // change here if bug
	})
	let SEC = get_lib_SEC()
	const STUB_ACTION = create_action_noop()

	beforeEach(() => {
		SEC = get_lib_SEC().createChild()
			.injectDependencies({ logger })
		local_storage.clear()
	})
	afterEach(() => {
		local_storage.clear()
	})

	const DEMO_LATEST = DEMO_STATE
	const DEMO_LATEST_ALT = enforce_immutability<State>({
		...DEMO_STATE,
		u_state: {
			...DEMO_STATE.u_state,
			revision: DEMO_STATE.u_state.revision - 3,
		}
	}) as any
	const DEMO_OLDER: Readonly<any> = enforce_immutability<WithSchemaVersion & WithRevision>({
		schema_version: 11,
		revision: 111,
	})
	const DEMO_OLDER_ALT: Readonly<any> = enforce_immutability<WithSchemaVersion & WithRevision>({
		...DEMO_OLDER,
		revision: DEMO_OLDER.revision - 1,
	} as any)
	const DEMO_OLDEST: Readonly<any> = enforce_immutability<WithSchemaVersion & WithRevision>({
		schema_version: 10,
		revision: 10,
	})

	describe('basic features', function () {

		describe('subscribe()', function() {

			context('on a non-initialized store', function () {

				it('should work', async () => {
					const store = create(SEC, local_storage, migrate_to_latest)
					const listener = sinon.stub()

					listener.resetHistory()
					store.subscribe('test', listener)
					await end_of_current_event_loop()
					expect(listener, '0').to.not.have.been.called // bc the store is not initialized yet

					store.set(DEMO_LATEST)
					await end_of_current_event_loop()
					expect(listener, '1').to.have.been.calledOnce
					listener.resetHistory()

					await all_planned_idle_executed()
					expect(listener, '1b').to.not.have.been.called

					store.on_dispatch(STUB_ACTION, DEMO_LATEST)
					await end_of_current_event_loop()
					expect(listener, '2').to.not.have.been.called // bc no change

					store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)
					await end_of_current_event_loop()
					expect(listener, '3').to.have.been.calledOnce
					listener.resetHistory()

					await all_planned_idle_executed()
					expect(listener, '3b').to.not.have.been.called
				})
			})

			context('on an initialized store', function () {

				it('should work', async () => {
					const store = create(SEC, local_storage, migrate_to_latest)
					store.set(DEMO_LATEST)
					await all_planned_idle_executed()

					const listener = sinon.spy(
						() => { /*console.log('listener called')*/ }
					)

					store.subscribe('test', listener)
					await end_of_current_event_loop()
					expect(listener, '0').to.have.been.calledOnce // bc was already inited
					listener.resetHistory()

					await all_planned_idle_executed()
					expect(listener, '0b').to.not.have.been.called

					listener.resetHistory()
					store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)
					await end_of_current_event_loop()
					expect(listener, '1').to.have.been.calledOnce // bc change

					listener.resetHistory()
					store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)
					await end_of_current_event_loop()
					expect(listener, '2').to.not.have.been.called // bc no change
				})
			})
		})
	})

	describe('side features', function() {

		it('get() should crash when not initialized', () => {
			const store = create(SEC, local_storage, migrate_to_latest)
			expect(store.get).to.throw('initialized')
		})

		it('set() should not signal when no change')
	})

	describe('storage', function() {

		context('when local storage is not available', function () {
			it('should report it')
		})

		context('when starting fresh', function () {

			it('should work', async () => {
				const store = create(SEC, local_storage, migrate_to_latest)
				let step = 'A'

				await all_planned_idle_executed()
				expect(local_storage, step).to.have.lengthOf(0)

				store.set(DEMO_LATEST)

				step = 'B'
				await all_planned_idle_executed()
				await all_planned_idle_executed()
				expect(local_storage, step).to.have.lengthOf(1)
				expect(local_storage.getItem(StorageKey.bkp_main), step).to.equal(stable_stringify(DEMO_LATEST))

				store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)

				step = 'C'
				await all_planned_idle_executed()
				await all_planned_idle_executed()
				expect(local_storage, step).to.have.lengthOf(2)
				expect(local_storage.getItem(StorageKey.bkp_main), step).to.equal(stable_stringify(DEMO_LATEST_ALT))
				expect(local_storage.getItem(StorageKey.bkp_minor), step).to.equal(stable_stringify(DEMO_LATEST))

				store.on_dispatch(STUB_ACTION, DEMO_LATEST)

				step = 'D'
				await all_planned_idle_executed()
				await all_planned_idle_executed()
				expect(local_storage, 'D').to.have.lengthOf(2)
				expect(local_storage.getItem(StorageKey.bkp_main), step).to.equal(stable_stringify(DEMO_LATEST))
				expect(local_storage.getItem(StorageKey.bkp_minor), step).to.equal(stable_stringify(DEMO_LATEST_ALT))
			})
		})

		context('when starting with existing content', function () {

			context('when the content is totally crap', function () {
				const BAD_LS_CONTENT = '{bad json, maybe edited by hand}'
				beforeEach(() => {
					local_storage.setItem(StorageKey.bkp_main, BAD_LS_CONTENT)
				})

				it('should work', async () => {
					const store = create(SEC, local_storage, migrate_to_latest)

					await all_planned_idle_executed()
					// nothing changed in LS
					expect(local_storage, 'unpersist ls size').to.have.lengthOf(1)
					expect(local_storage.getItem(StorageKey.bkp_main), 'unpersist main').to.equal(BAD_LS_CONTENT)
					// no state at all
					expect(store.get).to.throw('should be initialized')
				})
			})

			context('when the content is crap but some old stuff is recoverable', function () {
				const BAD_JSON = '{bad json, maybe edited by hand}'
				beforeEach(() => {
					local_storage.setItem(StorageKey.bkp_main, BAD_JSON)
					local_storage.setItem(StorageKey.bkp_major_old, stable_stringify(DEMO_OLDEST))
				})

				it('should work', async () => {
					const store = create(SEC, local_storage, migrate_to_latest)

					let step = 'sync'
					expect(get_schema_version_loose(store.get()), `${step} get`).to.equal(SCHEMA_VERSION)

					step = 'unpersist'
					await all_planned_idle_executed()
					expect(local_storage, `${step} ls size`).to.have.lengthOf(2) // no change on load
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(BAD_JSON)
					expect(local_storage.getItem(StorageKey.bkp_major_old), 'unpersist old').to.equal(stable_stringify(DEMO_OLDEST))

					// echo from dispatcher = no new info
					step = 'set'
					store.set(store.get())

					// still no change, no new info
					await all_planned_idle_executed()
					expect(local_storage, `${step} ls size`).to.have.lengthOf(2) // no change on load
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(BAD_JSON)
					expect(local_storage.getItem(StorageKey.bkp_major_old), 'unpersist old').to.equal(stable_stringify(DEMO_OLDEST))

					// actual activity = new info
					step = 'new'
					store.on_dispatch(STUB_ACTION, DEMO_LATEST)

					// NOW the bkp pipeline should have triggered
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					//console.log(storage_to_string(local_storage))
					expect(local_storage, `${step} ls size`).to.have.lengthOf(2)
					let main_bkp = JSON.parse(local_storage.getItem(StorageKey.bkp_main)!)
					expect(get_schema_version_loose(main_bkp), `${step} main`).to.equal(SCHEMA_VERSION)
					expect(store.get(), `${step} get`).to.deep.equal(main_bkp)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_LATEST))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(null)
					expect(local_storage.getItem(StorageKey.bkp_major_old), 'unpersist old').to.equal(stable_stringify(DEMO_OLDEST))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older`).to.equal(null)
				})
			})

			context('when the content is ok and full', function () {

				beforeEach(() => {
					local_storage.setItem(StorageKey.bkp_main, stable_stringify(DEMO_LATEST_ALT))
					local_storage.setItem(StorageKey.bkp_minor, stable_stringify(DEMO_LATEST))
					local_storage.setItem(StorageKey.bkp_major_old, stable_stringify(DEMO_OLDER))
					local_storage.setItem(StorageKey.bkp_major_older, stable_stringify(DEMO_OLDEST))
				})

				it('should work', async () => {
					const store = create(SEC, local_storage, migrate_to_latest)

					let step = 'sync'
					expect(store.get(), `${step} get`).to.deep.equal(DEMO_LATEST_ALT)

					step = 'unpersist'
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					// no change
					expect(local_storage, `${step} ls size`).to.have.lengthOf(4)
					let main_bkp = JSON.parse(local_storage.getItem(StorageKey.bkp_main)!)
					expect(get_schema_version_loose(main_bkp), `${step} main`).to.equal(SCHEMA_VERSION)
					expect(store.get(), `${step} get`).to.deep.equal(main_bkp)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.deep.equal(stable_stringify(DEMO_LATEST_ALT))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.deep.equal(stable_stringify(DEMO_LATEST))
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old str`).to.deep.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older str`).to.deep.equal(stable_stringify(DEMO_OLDEST))

					// echo from dispatcher
					store.set(store.get())

					// still no change
					step = 'unpersist2'
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					expect(local_storage, 'set').to.have.lengthOf(4)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.deep.equal(stable_stringify(DEMO_LATEST_ALT))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.deep.equal(stable_stringify(DEMO_LATEST))
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old str`).to.deep.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older str`).to.deep.equal(stable_stringify(DEMO_OLDEST))

					store.on_dispatch(STUB_ACTION, DEMO_LATEST)

					step = 'dispatch'
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					expect(local_storage, 'dispatch').to.have.lengthOf(4)
					expect(store.get(), 'dispatch').to.deep.equal(DEMO_LATEST)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_LATEST))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(stable_stringify(DEMO_LATEST_ALT))
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old str`).to.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older str`).to.equal(stable_stringify(DEMO_OLDEST))
				})
			})

			context('when the content is ok but old = new version -- only main', function () {
				beforeEach(() => {
					local_storage.setItem(StorageKey.bkp_main, stable_stringify(DEMO_OLDER))
				})

				it('should work', async () => {
					const store = create(SEC, local_storage, migrate_to_latest)

					let step = 'sync'
					expect(get_schema_version_loose(store.get()), `${step} get`).to.equal(SCHEMA_VERSION)

					step = 'unpersist'
					await all_planned_idle_executed()
					// no change
					expect(local_storage, `${step} ls size`).to.have.lengthOf(1)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_OLDER))

					// echo from dispatcher = no new info
					step = 'set'
					store.set(store.get())

					// still no change, no new info
					await all_planned_idle_executed()
					expect(local_storage, `${step} ls size`).to.have.lengthOf(1) // no change on load
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_OLDER))

					// actual activity = new info
					step = 'new'
					store.on_dispatch(STUB_ACTION, DEMO_LATEST)

					// NOW the bkp pipeline should have triggered
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					//console.log(storage_to_string(local_storage))
					expect(local_storage, `${step} ls size`).to.have.lengthOf(2)
					let main_bkp = JSON.parse(local_storage.getItem(StorageKey.bkp_main)!)
					expect(get_schema_version_loose(main_bkp), `${step} main`).to.equal(SCHEMA_VERSION)
					expect(store.get(), `${step} get`).to.deep.equal(main_bkp)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_LATEST))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(null)
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old`).to.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older`).to.equal(null)

					// actual activity = new info
					step = 'new2'
					store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)

					// normal
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					//console.log(storage_to_string(local_storage))
					expect(local_storage, `${step} ls size`).to.have.lengthOf(3)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_LATEST_ALT))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(stable_stringify(DEMO_LATEST))
					expect(local_storage.getItem(StorageKey.bkp_major_old), 'unpersist old').to.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older`).to.equal(null)
				})
			})

			context('when the content is ok and old = new version -- main & m1', function () {
				beforeEach(() => {
					local_storage.setItem(StorageKey.bkp_main, stable_stringify(DEMO_OLDER))
					local_storage.setItem(StorageKey.bkp_major_old, stable_stringify(DEMO_OLDEST))
				})

				it('should work', async () => {
					const store = create(SEC, local_storage, migrate_to_latest)

					let step = 'sync'
					expect(get_schema_version_loose(store.get()), `${step} get`).to.equal(SCHEMA_VERSION)

					// no change in LS
					step = 'unpersist'
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					//console.log(storage_to_string(local_storage))
					expect(local_storage, `${step} ls size`).to.have.lengthOf(2)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(null)
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old`).to.equal(stable_stringify(DEMO_OLDEST))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older`).to.equal(null)

					// echo from dispatcher
					step = 'echo'
					store.set(store.get())

					// no change
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					expect(local_storage, `${step} ls size`).to.have.lengthOf(2)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(null)
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old`).to.equal(stable_stringify(DEMO_OLDEST))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older`).to.equal(null)

					step = 'd1'
					store.on_dispatch(STUB_ACTION, DEMO_LATEST)

					// pipeline updated
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					//console.log(storage_to_string(local_storage))
					expect(local_storage, `${step} ls size`).to.have.lengthOf(3)
					let main_bkp = JSON.parse(local_storage.getItem(StorageKey.bkp_main)!)
					expect(get_schema_version_loose(main_bkp), `${step} main`).to.equal(SCHEMA_VERSION)
					expect(store.get(), `${step} get`).to.deep.equal(main_bkp)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_LATEST))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(null)
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old`).to.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older`).to.equal(stable_stringify(DEMO_OLDEST))

					step = 'd2'
					store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)

					// pipeline updated
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					//console.log(storage_to_string(local_storage))
					expect(local_storage, `${step} ls size`).to.have.lengthOf(4)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_LATEST_ALT))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(stable_stringify(DEMO_LATEST))
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old`).to.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older`).to.equal(stable_stringify(DEMO_OLDEST))
				})
			})

			context('when the content is ok and old = new version -- main & minor & m1', function () {
				beforeEach(() => {
					local_storage.setItem(StorageKey.bkp_main, stable_stringify(DEMO_OLDER))
					local_storage.setItem(StorageKey.bkp_minor, stable_stringify(DEMO_OLDER_ALT))
					local_storage.setItem(StorageKey.bkp_major_old, stable_stringify(DEMO_OLDEST))
				})

				it('should work', async () => {
					const store = create(SEC, local_storage, migrate_to_latest)

					let step = 'sync'
					expect(get_schema_version_loose(store.get()), `${step} get`).to.equal(SCHEMA_VERSION)

					// no change in LS
					step = 'unpersist'
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					//console.log(storage_to_string(local_storage))
					expect(local_storage, `${step} ls size`).to.have.lengthOf(3)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(stable_stringify(DEMO_OLDER_ALT))
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old`).to.equal(stable_stringify(DEMO_OLDEST))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older`).to.equal(null)

					// echo from dispatcher
					step = 'echo'
					store.set(store.get())

					// no change
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					expect(local_storage, `${step} ls size`).to.have.lengthOf(3)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(stable_stringify(DEMO_OLDER_ALT))
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old`).to.equal(stable_stringify(DEMO_OLDEST))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older`).to.equal(null)

					step = 'd1'
					store.on_dispatch(STUB_ACTION, DEMO_LATEST)

					// pipeline updated
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					console.log(storage_to_string(local_storage))
					expect(local_storage, `${step} ls size`).to.have.lengthOf(3)
					let main_bkp = JSON.parse(local_storage.getItem(StorageKey.bkp_main)!)
					expect(get_schema_version_loose(main_bkp), `${step} main`).to.equal(SCHEMA_VERSION)
					expect(store.get(), `${step} get`).to.deep.equal(main_bkp)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_LATEST))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(null)
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old`).to.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older`).to.equal(stable_stringify(DEMO_OLDEST))

					step = 'd2'
					store.on_dispatch(STUB_ACTION, DEMO_LATEST_ALT)

					// pipeline updated
					await all_planned_idle_executed()
					await all_planned_idle_executed()
					//console.log(storage_to_string(local_storage))
					expect(local_storage, `${step} ls size`).to.have.lengthOf(4)
					expect(local_storage.getItem(StorageKey.bkp_main), `${step} main str`).to.equal(stable_stringify(DEMO_LATEST_ALT))
					expect(local_storage.getItem(StorageKey.bkp_minor), `${step} minor str`).to.equal(stable_stringify(DEMO_LATEST))
					expect(local_storage.getItem(StorageKey.bkp_major_old), `${step} old`).to.equal(stable_stringify(DEMO_OLDER))
					expect(local_storage.getItem(StorageKey.bkp_major_older), `${step} older`).to.equal(stable_stringify(DEMO_OLDEST))
				})
			})
		})
	})
})
