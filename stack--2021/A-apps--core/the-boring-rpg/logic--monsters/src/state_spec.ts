import { expect } from 'chai'
import { Enum } from 'typescript-string-enums'
import { Random, Engine } from '@offirmo/random'
import { MAX_LEVEL } from '@tbrpg/definitions'

import {
	Monster,
	MonsterRank,
	create,
} from '.'

function assert_shape(monster: Readonly<Monster>) {
	expect(Object.keys(monster)).to.have.lengthOf(4)

	expect(monster.name).to.be.a('string')
	expect(monster.name.length).to.be.above(2)

	expect(monster.level).to.be.a('number')
	expect(monster.level).to.be.at.least(1)
	expect(monster.level).to.be.at.most(MAX_LEVEL)

	expect(monster.rank).to.be.a('string')
	expect(Enum.isType(MonsterRank, monster.rank)).to.be.true

	expect(monster.possible_emoji).to.be.a('string')
	expect(monster.possible_emoji).to.have.lengthOf(2) // emoji
}

describe('@oh-my-rpg/logic-monsters - factory', function() {

	it('should allow creating a random monster', function() {
		const rng: Engine = Random.engines.mt19937().seed(789)
		expect((rng as any).getUseCount(), '# rng draws 1').to.equal(0)

		const monster1 = create(rng)
		assert_shape(monster1)

		expect((rng as any).getUseCount(), '# rng draws 1').to.equal(4)

		const monster2 = create(rng)
		assert_shape(monster2)
		expect((rng as any).getUseCount(), '# rng draws 2').to.equal(10)
		expect(monster2).not.to.deep.equal(monster1)
	})

	it('should allow creating a partially predefined monster', function() {
		const rng: Engine = Random.engines.mt19937().seed(123)
		const monster = create(rng, {
			name: 'crab',
			level: 12,
		})
		assert_shape(monster)
		expect(monster).to.deep.equal({
			name: 'crab',
			level: 12,
			rank: MonsterRank.common,
			possible_emoji: '🦀',
		})
		expect((rng as any).getUseCount(), '# rng draws').to.equal(3) // less random picks
	})
})
