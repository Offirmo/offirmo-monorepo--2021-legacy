import { expect } from 'chai'
import { Random, Engine } from '@offirmo/random'

import { generate_uuid, UUID, WithUUID, xxx_test_unrandomize_element } from '.'


interface Test extends WithUUID {
	another: UUID
}


describe('@offirmo-private/uuid - utils', function() {
	describe('xxx_test_unrandomize_element()', function() {
		context('when provided a uuid prop', function() {
			it('should turn it into a fixed value', function () {
				const rng: Engine = Random.engines.mt19937().seed(123)

				const out: Readonly<Test> = {
					uuid: generate_uuid({rng}),
					another: generate_uuid({rng}),
				}

				const randomized: Readonly<Test> = xxx_test_unrandomize_element(out)

				expect(randomized.uuid).not.to.equal(out.uuid)
				expect(randomized.another).to.equal(out.another)
			})
		})
	})
})
