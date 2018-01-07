import { expect } from 'chai'

import { Random, Engine } from '@offirmo/random'

import {
	ENTRIES
} from '.'

describe('🐀 🐉  monster logic - data:', function() {

	it('should have all the expected monsters', () => {
		expect(ENTRIES).to.have.lengthOf(71)
	})
})
