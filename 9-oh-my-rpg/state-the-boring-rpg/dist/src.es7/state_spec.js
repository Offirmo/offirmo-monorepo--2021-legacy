import { expect } from 'chai';
import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng';
import { ALL_GOOD_ADVENTURE_ARCHETYPES } from '@oh-my-rpg/logic-adventures';
import { get_unequipped_item_count, get_equipped_item_count, } from '@oh-my-rpg/state-inventory';
import { Currency, get_currency_amount, } from '@oh-my-rpg/state-wallet';
import { SCHEMA_VERSION } from './consts';
import { create, play, find_element, appraise_item, } from '.';
describe('reducer', function () {
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
            expect(Object.keys(state), 'quick key count check').to.have.lengthOf(13); // this test should be updated if that changes
            // init of custom values
            expect(state).to.have.property('schema_version', SCHEMA_VERSION);
            expect(state).to.have.property('revision', 0);
            expect(state).to.have.property('click_count', 0);
            expect(state).to.have.property('good_click_count', 0);
            expect(state).to.have.property('meaningful_interaction_count', 0);
            expect(state.last_adventure).to.be.null;
            // check our 2 predefined items are present and equipped
            expect(get_equipped_item_count(state.inventory), 'equipped').to.equal(2);
            expect(get_unequipped_item_count(state.inventory), 'unequipped').to.equal(0);
        });
    });
    describe('👆🏾 user actions', function () {
        describe('🤘🏽 play', function () {
            context('🚫  when NOT allowed (the cooldown has NOT passed / not enough energy)', function () {
                it('should generate a negative adventure', () => {
                    let state = create();
                    // 7 good plays
                    state = play(state);
                    state = play(state);
                    state = play(state);
                    state = play(state);
                    state = play(state);
                    state = play(state);
                    state = play(state);
                    // too soon...
                    expect(state.energy.last_available_energy_float).to.be.below(1);
                    state = play(state);
                    expect(state.last_adventure).not.to.be.null;
                    expect(state.last_adventure.good).to.be.false;
                    // again
                    state = play(state);
                    expect(state.last_adventure).not.to.be.null;
                    expect(state.last_adventure.good).to.be.false;
                });
                it('should not decrease user stats');
                it('should punish a bit the user (ex. by increasing the cooldown)', () => {
                    let state = create();
                    // 7 good plays
                    state = play(state);
                    state = play(state);
                    state = play(state);
                    state = play(state);
                    state = play(state);
                    state = play(state);
                    state = play(state);
                    // too soon...
                    expect(state.energy.last_available_energy_float).to.be.below(1);
                    // force (for tests)
                    state.energy.last_available_energy_float = .8;
                    state = play(state);
                    expect(state.last_adventure).not.to.be.null;
                    expect(state.last_adventure.good).to.be.false;
                    expect(state.energy.last_available_energy_float).to.be.below(0.0001);
                });
                it('may actually result in a good outcome (idea TODO)');
            });
            context('✅  when allowed (the cooldown has passed / enough energy)', function () {
                it('should sometime generate a story adventure', () => {
                    const state = play(create());
                    expect(state.last_adventure).not.to.be.null;
                    expect(state.last_adventure.good).to.be.true;
                });
                it('should correctly increment counters', () => {
                    const state = play(create());
                    expect(state).to.have.property('click_count', 1);
                    expect(state).to.have.property('good_click_count', 1);
                    expect(state).to.have.property('meaningful_interaction_count', 1);
                });
                it('should sometime generate a fight adventure', () => {
                    let fightCount = 0;
                    let state = create();
                    for (let i = 0; i < 20; ++i) {
                        state = play(state);
                        // force (for tests)
                        state.energy.last_available_energy_float = 7.;
                        if (state.last_adventure.hid.startsWith('fight_'))
                            fightCount++;
                    }
                    expect(fightCount).to.be.above(3);
                });
                context('when the adventure is a story', function () {
                    describe('the outcome', function () {
                        it('should sometime be a coin gain', () => {
                            let state = create();
                            state = play(state, 'dying_man');
                            // we got money
                            expect(get_currency_amount(state.wallet, Currency.coin)).to.be.above(0);
                        });
                        it('should sometime be a token gain');
                        it('should sometime be a stat gain');
                        it('should sometime be an item gain', () => {
                            let state = create();
                            state = play(state, 'rare_goods_seller');
                            // check our 2 predefined items are still present and equipped
                            expect(get_equipped_item_count(state.inventory), 'equipped').to.equal(2);
                            // a new item is present
                            expect(get_unequipped_item_count(state.inventory), 'unequipped').to.equal(1);
                            // it's a weapon !
                            expect(state.inventory.unslotted[0]).to.have.property('slot', 'armor');
                        });
                        it('should sometime be an item improvement');
                    });
                });
                context('when the adventure is a fight', function () {
                    it('should generate a suitable enemy', () => {
                        let state = create();
                        state.avatar.attributes.level = 500;
                        for (let i = 0; i < 20; ++i) {
                            state = play(state);
                            if (state.last_adventure.hid.startsWith('fight_'))
                                break;
                        }
                        //console.log(state.last_adventure)
                        expect(state.last_adventure.encounter).to.exist;
                        expect(state.last_adventure.encounter.level).to.be.within(400, 600);
                    });
                });
            });
        });
        describe('inventory management', function () {
            it('should allow un-equiping an item'); // not now, but useful for ex. for immediately buying a better item on the market
            it('should allow equiping an item, correctly swapping with an already equipped item');
            it('should allow selling an item');
        });
    });
    describe('Helper functions', function () {
        describe('find_element() by uuid', function () {
            context('when the element refers to an item', function () {
                it('should find it', () => {
                    const state = create();
                    const armor = state.inventory.slotted.armor;
                    const element = find_element(state, armor.uuid);
                    expect(element).to.deep.equal(armor);
                });
            });
            context('when the uuid refers to nothing', function () {
                it('should return null', () => {
                    const state = create();
                    const element = find_element(state, 'foo');
                    expect(element).to.be.null;
                });
            });
        });
        describe('appraise_item() by uuid', function () {
            context('when the element refers to an item', function () {
                it('should find it and appraise it', () => {
                    const state = create();
                    const armor = state.inventory.slotted.armor;
                    const price = appraise_item(state, armor.uuid);
                    expect(price).to.equal(5);
                });
            });
            context('when the uuid refers to nothing', function () {
                it('should throw', () => {
                    const state = create();
                    const attempt_appraise = () => void appraise_item(state, 'foo');
                    expect(attempt_appraise).to.throw('No item');
                });
            });
        });
    });
    describe('adventures', function () {
        ALL_GOOD_ADVENTURE_ARCHETYPES.forEach(({ hid, good }) => {
            describe(`${good ? '✅' : '🚫'}  adventure "${hid}"`, function () {
                it('should be playable', () => {
                    let state = create();
                    state = play(state, hid);
                });
            });
        });
    });
});
//# sourceMappingURL=state_spec.js.map