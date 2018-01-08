import { expect } from 'chai';
import { Random } from '@offirmo/random';
import { MonsterRank, create, } from '.';
describe('🐀 🐉  monster logic - factory:', function () {
    describe('creation', function () {
        it('should allow creating a random monster', function () {
            const rng = Random.engines.mt19937().seed(789);
            expect(rng.getUseCount(), '# rng draws 1').to.equal(0);
            const monster1 = create(rng);
            expect(monster1).to.deep.equal({
                name: 'drop bear',
                level: 808,
                rank: MonsterRank.common,
                possible_emoji: '🐨',
            });
            expect(rng.getUseCount(), '# rng draws 1').to.equal(4);
            const monster2 = create(rng);
            expect(rng.getUseCount(), '# rng draws 2').to.equal(10);
            expect(monster2).not.to.deep.equal(monster1);
        });
        it('should allow creating a partially predefined monster', function () {
            const rng = Random.engines.mt19937().seed(123);
            const monster = create(rng, {
                name: 'crab',
                level: 12,
            });
            expect(monster).to.deep.equal({
                name: 'crab',
                level: 12,
                rank: MonsterRank.common,
                possible_emoji: '🦀',
            });
            expect(rng.getUseCount(), '# rng draws').to.equal(3); // less random picks
        });
    });
});
//# sourceMappingURL=factory_spec.js.map