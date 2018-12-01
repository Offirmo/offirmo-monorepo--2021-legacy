import { expect } from 'chai';
import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng';
import { get_unequipped_item_count, get_equipped_item_count, } from '@oh-my-rpg/state-inventory';
import { DEFAULT_SEED } from '@oh-my-rpg/state-prng';
import { LIB, SCHEMA_VERSION } from '../../consts';
import { create, reseed } from '.';
describe(`${LIB} - reducer`, function () {
    beforeEach(() => xxx_internal_reset_prng_cache());
    describe('🆕  initial state', function () {
        it('should be correct', function () {
            const state = create();
            expect(state.uuid).to.be.a('string');
            expect(state.creation_date).to.be.a('string');
            // check presence of sub-states
            expect(state, 'avatar').to.have.property('avatar');
            expect(state, 'inventory').to.have.property('inventory');
            expect(state, 'wallet').to.have.property('wallet');
            expect(state, 'prng').to.have.property('prng');
            expect(state, 'energy').to.have.property('energy');
            expect(state, 'engagement').to.have.property('engagement');
            expect(state, 'codes').to.have.property('codes');
            expect(state, 'codes').to.have.property('progress');
            expect(Object.keys(state), 'quick key count check').to.have.lengthOf(13); // because this test should be updated if that changes
            // init of custom values
            expect(state).to.have.property('schema_version', SCHEMA_VERSION);
            expect(state).to.have.property('revision', 0);
            expect(state.last_adventure).to.be.null;
            // check our 2 predefined items are present and equipped
            expect(get_equipped_item_count(state.inventory), 'equipped').to.equal(2);
            expect(get_unequipped_item_count(state.inventory), 'unequipped').to.equal(0);
        });
    });
    describe('re-seeding', function () {
        it('should work', function () {
            const state = reseed(create());
            expect(state.prng.seed).to.be.a('number');
            expect(state.prng.seed).not.to.equal(DEFAULT_SEED);
        });
    });
});
//# sourceMappingURL=create_spec.js.map