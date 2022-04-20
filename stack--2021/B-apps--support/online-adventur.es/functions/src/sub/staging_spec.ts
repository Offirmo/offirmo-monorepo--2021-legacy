import { expect } from 'chai'
import { getRootSEC } from '@offirmo-private/soft-execution-context'
import { Enum } from 'typescript-string-enums'

import { fetch_oa, ReleaseChannel, Endpoint, SERVER_RESPONSE_VERSION } from '@online-adventur.es/api-client'

import { APP } from './consts'


describe(`${APP} - live`, function() {
	const SEC = getRootSEC()
		.createChild()
		.setLogicalStack({module: 'UT'})

	describe('staging', function() {
		this.timeout(10_000)

		before(() => {
			SEC.injectDependencies({ CHANNEL: ReleaseChannel.staging })
		})

		describe(`404`, function() {

			it('should be handled properly', () => {
				const ↆresult = fetch_oa({
					SEC,
					method: 'GET',
					url: 'foo-xyz',
				})

				return expect(ↆresult).to.eventually.be.rejectedWith('404')
			})
		})

		Enum.values(Endpoint)
			//.filter(e => e !== 'report-error')
			.forEach((endpoint) => {

			describe(`/${endpoint}`, function() {

				it('should exist', () => {
					const ↆresult = fetch_oa({
						SEC,
						method: 'GET',
						url: endpoint,
					})

					return expect(ↆresult).not.to.eventually.be.rejectedWith('404')
				})

				it('should respond properly', () => {
					const ↆresult = fetch_oa({
						SEC,
						method: 'GET',
						url: endpoint,
					})

					return ↆresult.then(
						() => { /* all good */ },
						err => {
							if (err.message.includes('not logged in')) {
								// expected, all good
								return
							}

							if (endpoint === 'hello-world' && err.message.includes('invalid json')) {
								// expected, primitive endpoint not to be queried with fetch_oa()
								return
							}

							if (endpoint === 'test-error-handling' && err.message.includes('Please provide a failure mode')) {
								// expected, endpoint needs a param
								return
							}

							console.error('unexpected error:', err)
							throw err
						}
					)
				})
			})
		})

		/*
		it('should work when receiving data', async function () {
			this.timeout(10_000)

			const result = await fetch_oa({
				SEC,
				method: 'GET',
				url: Endpoint['test-error-handling'] + '?mode=none',
				//url: Endpoint['hello-world-advanced'] + '/foo?bar=42',
				//url: Endpoint.echo + '/foo?bar=42',
			})

			expect(result).to.have.deep.property('data', 'All good, test of no error')
			expect(result).not.to.have.deep.property('error') // none
			expect(result).not.to.have.deep.property('meta') // this should be removed, internal/debug use only
			expect(result).not.to.have.deep.property('v') // same
		})


		it('should work when receiving an error', function () {
			this.timeout(10_000)

			const ↆresult = fetch_oa({
				SEC,
				method: 'GET',
				url: Endpoint['test-error-handling'] + '?mode=unhandled-rejection',
			})
			expect(ↆresult).to.be.eventually.be.rejectedWith('unhandled-rejection')
		})*/
	})
})
