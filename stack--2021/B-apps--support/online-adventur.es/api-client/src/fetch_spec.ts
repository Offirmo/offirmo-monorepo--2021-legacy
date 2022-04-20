import { expect } from 'chai'
import { getRootSEC } from '@offirmo-private/soft-execution-context'

import { ReleaseChannel, Endpoint, SERVER_RESPONSE_VERSION } from '@online-adventur.es/api-interface'

import { LIB } from './consts'
import { fetch_oa } from './fetch'


describe(`${LIB} - fetch`, function() {
	const SEC = getRootSEC()
		.createChild()
		.setLogicalStack({module: 'UT'})
		.injectDependencies({ CHANNEL: ReleaseChannel.staging })

	describe('fetch_oa()', function() {

		it('should handle 404 properly', function () {
			this.timeout(10_000)
			const ↆresult = fetch_oa({
				SEC,
				method: 'GET',
				url: 'foo-bar-baz',
			})
			return expect(ↆresult).to.eventually.be.rejectedWith('404')
		})

		it('should handle a non-json response (should not happen)', function () {
			this.timeout(10_000)
			const ↆresult = fetch_oa({
				SEC,
				method: 'GET',
				url: 'hello-world',
			})
			return expect(ↆresult).to.eventually.be.rejectedWith('invalid json')
		})

		it('should handle receiving an error properly', function () {
			this.timeout(10_000)
			//const failure_mode = 'unhandled-rejection' this mode doesn't work as of 2021/04 :sad: TODO fix
			const failure_mode = 'throw-sync'
			const ↆresult = fetch_oa({
				SEC,
				method: 'GET',
				url: Endpoint['test-error-handling'] + '?mode=' + failure_mode,
			})
			return expect(ↆresult).to.eventually.be.rejectedWith(failure_mode)
		})

		it('should work when receiving data', async function () {
			this.timeout(10_000)
			const result = await fetch_oa({
				SEC,
				method: 'GET',
				url: Endpoint['test-error-handling'] + '?mode=none',
				//url: Endpoint['hello-world-advanced'] + '/foo?bar=42',
				//url: Endpoint.echo + '/foo?bar=42',
			})

			return Promise.all([
				expect(result).to.have.deep.property('data', 'All good, test of no error'),
				expect(result).not.to.have.deep.property('error'), // none
				expect(result).not.to.have.deep.property('meta'), // this should be removed, internal/debug use only
				expect(result).not.to.have.deep.property('v'), // same
			])
		})
	})
})
