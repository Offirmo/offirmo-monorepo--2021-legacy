import { expect } from 'chai'
import { getRootSEC } from '@offirmo-private/soft-execution-context'

import { ReleaseChannel } from './types'
import { LIB, Endpoint } from './consts'
import { fetch_oa } from './fetch'

describe(`${LIB} - fetch`, function() {
	const SEC = getRootSEC()
		.createChild()
		.setLogicalStack({module: 'UT'})
		//.injectDependencies({ CHANNEL: ReleaseChannel.staging })

	describe('fetch_oa()', function() {

		it('should work when receiving data', async function () {
			this.timeout(10_000)

			const result = await fetch_oa({
				SEC,
				method: 'GET',
				url: Endpoint['hello-world-advanced'] + '/foo?bar=42',
				//url: Endpoint.echo + '/foo?bar=42',
			})

			expect(result).to.deep.equal({
				data: "Hello, Fake User For Dev!",
				side: {},
			})
		})


		it.only('should work when receiving an error', function () {
			this.timeout(10_000)

			return fetch_oa({
				SEC,
				method: 'GET',
				url: Endpoint['test-error-handling'] + '?mode=unhandled-rejection',
			}).should.be.rejectedWith('xx')
		})
	})
})
