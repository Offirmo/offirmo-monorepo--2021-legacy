"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const random_1 = require("@offirmo/random");
const _1 = require(".");
describe('⚔ 💰  adventures', function () {
    describe('logic:', function () {
        describe('bad adventures picker', function () {
            it('should provide bad adventure archetypes', () => {
                const rng = random_1.Random.engines.mt19937().seed(789);
                const baa1 = _1.pick_random_bad_archetype(rng);
                chai_1.expect(baa1.good).to.be.false;
                const baa2 = _1.pick_random_bad_archetype(rng);
                chai_1.expect(baa2.good).to.be.false;
            });
        });
        describe('good adventures picker', function () {
            it('should provide good adventure archetypes', () => {
                const rng = random_1.Random.engines.mt19937().seed(789);
                const baa1 = _1.pick_random_good_archetype(rng);
                chai_1.expect(baa1.good).to.be.true;
                const baa2 = _1.pick_random_good_archetype(rng);
                chai_1.expect(baa2.good).to.be.true;
            });
        });
        describe('coin gain picker', function () {
            it('should provide an amount proportional to the gain category', () => {
                const rng = random_1.Random.engines.mt19937().seed(789);
                const level = 1 / 1.1; // hack
                const cgN1 = _1.generate_random_coin_gain(rng, _1.CoinsGain.none, level);
                chai_1.expect(cgN1).to.equal(0);
                const cgN2 = _1.generate_random_coin_gain(rng, _1.CoinsGain.none, level);
                chai_1.expect(cgN2).to.equal(0);
                const cgS1 = _1.generate_random_coin_gain(rng, _1.CoinsGain.small, level);
                chai_1.expect(cgS1).to.be.gte(1);
                chai_1.expect(cgS1).to.be.lte(20);
                const cgS2 = _1.generate_random_coin_gain(rng, _1.CoinsGain.small, level);
                chai_1.expect(cgS2).to.be.gte(1);
                chai_1.expect(cgS2).to.be.lte(20);
                const cgM1 = _1.generate_random_coin_gain(rng, _1.CoinsGain.medium, level);
                chai_1.expect(cgM1).to.be.gte(50);
                chai_1.expect(cgM1).to.be.lte(100);
                const cgM2 = _1.generate_random_coin_gain(rng, _1.CoinsGain.medium, level);
                chai_1.expect(cgM2).to.be.gte(50);
                chai_1.expect(cgM2).to.be.lte(100);
                const cgB1 = _1.generate_random_coin_gain(rng, _1.CoinsGain.big, level);
                chai_1.expect(cgB1).to.be.gte(500);
                chai_1.expect(cgB1).to.be.lte(700);
                const cgB2 = _1.generate_random_coin_gain(rng, _1.CoinsGain.big, level);
                chai_1.expect(cgB2).to.be.gte(500);
                chai_1.expect(cgB2).to.be.lte(700);
                const cgH1 = _1.generate_random_coin_gain(rng, _1.CoinsGain.huge, level);
                chai_1.expect(cgH1).to.be.gte(900);
                chai_1.expect(cgH1).to.be.lte(2000);
                const cgH2 = _1.generate_random_coin_gain(rng, _1.CoinsGain.huge, level);
                chai_1.expect(cgH2).to.be.gte(900);
                chai_1.expect(cgH2).to.be.lte(2000);
            });
            it('should provide an amount proportional to the player level');
        });
    });
    describe('data:', function () {
        _1.ALL_ADVENTURE_ARCHETYPES.forEach(function ({ hid }) {
            describe(`hid "${hid}"`, function () {
                it('should have an en i18n message', () => {
                    const _ = _1.i18n_messages.en;
                    chai_1.expect(_).to.have.nested.property(`adventures.${hid}`);
                    chai_1.expect(_.adventures[hid]).to.be.a('string');
                });
            });
        });
    });
});
//# sourceMappingURL=index_spec.js.map