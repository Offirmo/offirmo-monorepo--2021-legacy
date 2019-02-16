import { expect } from 'chai'

import { LIB } from './consts'

import { ELEMENTS } from '.'

describe(`${LIB} - rsrcs`, function() {

	ELEMENTS.forEach((artwork, index) => {
		describe(`artwork #${index} "${artwork.display_name}" by ${artwork.author.display_name}`, function() {
			it('should have a source', () => {
				expect(artwork.source.length, 'source').to.be.above(12)
			})
			it('should be aligned', () => {
				expect(artwork.position_pct.x !== 50 || artwork.position_pct.y !== 50, 'alignment').to.be.true
			})
		})
	})
})
