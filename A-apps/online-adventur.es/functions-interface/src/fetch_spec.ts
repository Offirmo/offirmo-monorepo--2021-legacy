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

		it('should work', async function () {
			this.timeout(10_000)

			await fetch_oa({
				SEC,
				method: 'GET',
				url: Endpoint.echo + '/foo?bar=42',
			})
		})
	})
})
