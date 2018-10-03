"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const typescript_string_enums_1 = require("typescript-string-enums");
const random_1 = require("@offirmo/random");
const definitions_1 = require("@oh-my-rpg/definitions");
const _1 = require(".");
function assert_shape(monster) {
    chai_1.expect(Object.keys(monster)).to.have.lengthOf(4);
    chai_1.expect(monster.name).to.be.a('string');
    chai_1.expect(monster.name.length).to.be.above(2);
    chai_1.expect(monster.level).to.be.a('number');
    chai_1.expect(monster.level).to.be.at.least(1);
    chai_1.expect(monster.level).to.be.at.most(definitions_1.MAX_LEVEL);
    chai_1.expect(monster.rank).to.be.a('string');
    chai_1.expect(typescript_string_enums_1.Enum.isType(_1.MonsterRank, monster.rank)).to.be.true;
    chai_1.expect(monster.possible_emoji).to.be.a('string');
    chai_1.expect(monster.possible_emoji).to.have.lengthOf(2); // emoji
}
describe('@oh-my-rpg/logic-monsters - factory', function () {
    it('should allow creating a random monster', function () {
        const rng = random_1.Random.engines.mt19937().seed(789);
        chai_1.expect(rng.getUseCount(), '# rng draws 1').to.equal(0);
        const monster1 = _1.create(rng);
        assert_shape(monster1);
        chai_1.expect(rng.getUseCount(), '# rng draws 1').to.equal(4);
        const monster2 = _1.create(rng);
        assert_shape(monster2);
        chai_1.expect(rng.getUseCount(), '# rng draws 2').to.equal(10);
        chai_1.expect(monster2).not.to.deep.equal(monster1);
    });
    it('should allow creating a partially predefined monster', function () {
        const rng = random_1.Random.engines.mt19937().seed(123);
        const monster = _1.create(rng, {
            name: 'crab',
            level: 12,
        });
        assert_shape(monster);
        chai_1.expect(monster).to.deep.equal({
            name: 'crab',
            level: 12,
            rank: _1.MonsterRank.common,
            possible_emoji: '🦀',
        });
        chai_1.expect(rng.getUseCount(), '# rng draws').to.equal(3); // less random picks
    });
});
//# sourceMappingURL=factory_spec.js.map