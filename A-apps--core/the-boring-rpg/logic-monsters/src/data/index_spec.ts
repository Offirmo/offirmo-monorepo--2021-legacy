import { expect } from 'chai'

import { Random, Engine } from '@offirmo/random'

import {
	ENTRIES,
} from '.'

describe('@oh-my-rpg/logic-monsters - data:', function() {

	it('should have all the expected monsters', () => {
		expect(ENTRIES).to.have.lengthOf(76)
	})
})
