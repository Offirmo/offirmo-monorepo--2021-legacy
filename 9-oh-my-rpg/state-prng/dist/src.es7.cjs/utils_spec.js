"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const random_1 = require("@offirmo/random");
const _1 = require(".");
describe('🎲  Persistable PRNG state - utils', function () {
    beforeEach(_1.xxx_internal_reset_prng_cache);
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
    describe('optional duplicate prevention', function () {
        const id = 'tails_or_head';
        it('should prevent repetition up to 1', () => {
            let state = _1.create();
            const prng = _1.get_prng(state);
            function gen() {
                let val = _1.regenerate_until_not_recently_encountered({
                    id,
                    generate: () => random_1.Random.integer(0, 1)(prng),
                    state,
                });
                state = _1.register_recently_used(state, id, val, 1);
                return val;
            }
            chai_1.expect(gen(), 'gen 1').to.equal(1);
            chai_1.expect(gen(), 'gen 2').to.equal(0);
            chai_1.expect(gen(), 'gen 3').to.equal(1);
            chai_1.expect(gen(), 'gen 4').to.equal(0);
        });
        it('should prevent repetition up to N', () => {
            let state = _1.create();
            const prng = _1.get_prng(state);
            state = _1.register_recently_used(state, id, 0, 9);
            state = _1.register_recently_used(state, id, 1, 9);
            state = _1.register_recently_used(state, id, 2, 9);
            state = _1.register_recently_used(state, id, 3, 9);
            state = _1.register_recently_used(state, id, 4, 9);
            state = _1.register_recently_used(state, id, 5, 9);
            state = _1.register_recently_used(state, id, 6, 9);
            state = _1.register_recently_used(state, id, 7, 9);
            state = _1.register_recently_used(state, id, 8, 9);
            function gen() {
                let val = _1.regenerate_until_not_recently_encountered({
                    id,
                    generate: () => random_1.Random.integer(0, 9)(prng),
                    state,
                    max_tries: 50,
                });
                state = _1.register_recently_used(state, id, val, 9);
                return val;
            }
            chai_1.expect(gen(), 'gen 1').to.equal(9);
            chai_1.expect(gen(), 'gen 2').to.equal(0);
            chai_1.expect(gen(), 'gen 3').to.equal(1);
        });
        it('should throw after too many attempts of avoiding repetition');
        it('should allow isolated named pools of non-repetition');
    });
});
//# sourceMappingURL=utils_spec.js.map