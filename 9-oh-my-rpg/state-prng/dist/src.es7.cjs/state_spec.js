"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const random_1 = require("@offirmo/random");
const consts_1 = require("./consts");
const _1 = require(".");
describe('🎲  Persistable PRNG state - reducer', function () {
    beforeEach(_1.xxx_internal_reset_prng_cache);
    describe('🆕  initial value', function () {
        it('should have correct defaults', function () {
            const state = _1.create();
            chai_1.expect(state).to.deep.equal({
                schema_version: consts_1.SCHEMA_VERSION,
                revision: 0,
                seed: _1.DEFAULT_SEED,
                use_count: 0,
            });
        });
    });
    describe('🌰  set seed', function () {
        it('should work and reset use count');
    });
    describe('update after use', function () {
        it('should correctly persist prng state', function () {
            let state = _1.create();
            let prng = _1.get_prng(state);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 1').to.equal(2);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 2').to.equal(5);
            state = _1.update_use_count(state, prng);
            chai_1.expect(state.use_count).to.equal(2);
        });
    });
    describe('get_prng', function () {
        it('should return a working PRNG engine', function () {
            const state = _1.create();
            const prng = _1.get_prng(state);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 1').to.equal(2);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 2').to.equal(5);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 3').to.equal(7);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 4').to.equal(0);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 5').to.equal(0);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 6').to.equal(3);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 7').to.equal(6);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 8').to.equal(10);
        });
        it('should return a repeatable PRNG engine', function () {
            let state = _1.create();
            let prng = _1.get_prng(state);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 1').to.equal(2);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 2').to.equal(5);
            state = _1.update_use_count(state, prng);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 3a').to.equal(7);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 4a').to.equal(0);
            _1.xxx_internal_reset_prng_cache();
            prng = _1.get_prng(state);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 3b').to.equal(7);
            chai_1.expect(random_1.Random.integer(0, 10)(prng), 'random 4b').to.equal(0);
        });
    });
    describe('generate_random_seed', function () {
        it('should return a random seed', function () {
            const s1 = _1.generate_random_seed();
            const s2 = _1.generate_random_seed();
            const s3 = _1.generate_random_seed();
            chai_1.expect(s1).not.to.equal(s2);
            chai_1.expect(s1).not.to.equal(s3);
            chai_1.expect(s2).not.to.equal(s3);
        });
    });
});
//# sourceMappingURL=state_spec.js.map