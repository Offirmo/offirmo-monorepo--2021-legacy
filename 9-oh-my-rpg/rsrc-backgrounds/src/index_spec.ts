import { expect } from 'chai'

import { LIB } from './consts'

import { ELEMENTS } from '.'

describe(`${LIB} - rsrcs`, function() {

	ELEMENTS.forEach((artwork, index) => {
		describe(`artwork #${index} "${artwork.display_name}" by ${artwork.author.display_name}`, function() {
			it('should have a source', () => {
				expect(artwork.source.length, 'source').to.be.above(12)
			})
			it('should be manually aligned', () => {
				if (artwork.position_pct.x === 50 && artwork.position_pct.y === 50) {
					expect(artwork.position_pct.x, 'alignment x').to.not.equal(50)
					expect(artwork.position_pct.y, 'alignment y').to.not.equal(50)
				}
			})
			it('should have a lowercase CSS class', () => {
				expect(artwork.css_class.toLowerCase()).to.equal(artwork.css_class)
			})
		})
	})

	describe('copy/past error prevention', function() {
		it('shouldn’t have duplicated url', () => {
			const s = new Set<string>()
			ELEMENTS.forEach((artwork, index) => {
				expect(s.has(artwork.source), artwork.css_class).to.be.false
				s.add(artwork.source)
			})
		})
		it('shouldn’t have duplicated css classes', () => {
			const s = new Set<string>()
			ELEMENTS.forEach((artwork, index) => {
				expect(s.has(artwork.css_class), artwork.css_class).to.be.false
				s.add(artwork.css_class)
			})
		})
	})
})
