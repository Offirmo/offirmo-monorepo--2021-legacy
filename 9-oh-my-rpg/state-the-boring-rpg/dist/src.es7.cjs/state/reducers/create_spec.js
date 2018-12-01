"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const state_prng_1 = require("@oh-my-rpg/state-prng");
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
const state_prng_2 = require("@oh-my-rpg/state-prng");
const consts_1 = require("../../consts");
const _1 = require(".");
describe(`${consts_1.LIB} - reducer`, function () {
    beforeEach(() => state_prng_1.xxx_internal_reset_prng_cache());
    describe('🆕  initial state', function () {
        it('should be correct', function () {
            const state = _1.create();
            chai_1.expect(state.uuid).to.be.a('string');
            chai_1.expect(state.creation_date).to.be.a('string');
            // check presence of sub-states
            chai_1.expect(state, 'avatar').to.have.property('avatar');
            chai_1.expect(state, 'inventory').to.have.property('inventory');
            chai_1.expect(state, 'wallet').to.have.property('wallet');
            chai_1.expect(state, 'prng').to.have.property('prng');
            chai_1.expect(state, 'energy').to.have.property('energy');
            chai_1.expect(state, 'engagement').to.have.property('engagement');
            chai_1.expect(state, 'codes').to.have.property('codes');
            chai_1.expect(state, 'codes').to.have.property('progress');
            chai_1.expect(Object.keys(state), 'quick key count check').to.have.lengthOf(13); // because this test should be updated if that changes
            // init of custom values
            chai_1.expect(state).to.have.property('schema_version', consts_1.SCHEMA_VERSION);
            chai_1.expect(state).to.have.property('revision', 0);
            chai_1.expect(state.last_adventure).to.be.null;
            // check our 2 predefined items are present and equipped
            chai_1.expect(state_inventory_1.get_equipped_item_count(state.inventory), 'equipped').to.equal(2);
            chai_1.expect(state_inventory_1.get_unequipped_item_count(state.inventory), 'unequipped').to.equal(0);
        });
    });
    describe('re-seeding', function () {
        it('should work', function () {
            const state = _1.reseed(_1.create());
            chai_1.expect(state.prng.seed).to.be.a('number');
            chai_1.expect(state.prng.seed).not.to.equal(state_prng_2.DEFAULT_SEED);
        });
    });
});
//# sourceMappingURL=create_spec.js.map