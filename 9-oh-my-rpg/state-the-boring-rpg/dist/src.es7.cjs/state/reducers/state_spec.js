"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_adventures_1 = require("@oh-my-rpg/logic-adventures");
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
const EnergyState = tslib_1.__importStar(require("@oh-my-rpg/state-energy"));
const state_wallet_1 = require("@oh-my-rpg/state-wallet");
const consts_1 = require("../../consts");
const __1 = require("..");
describe('@oh-my-rpg/state-the-boring-rpg - reducer', function () {
    beforeEach(() => state_prng_1.xxx_internal_reset_prng_cache());
    describe('🆕  initial state', function () {
        it('should be correct', function () {
            const state = __1.create();
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
    describe('👆🏾 user actions', function () {
        describe('🤘🏽 play', function () {
            context('🚫  when NOT allowed (the cooldown has NOT passed / not enough energy)', function () {
                it('should generate a negative adventure', () => {
                    let state = __1.create();
                    // force deplete energy
                    state = Object.assign({}, state, { energy: EnergyState.loose_all_energy(state.energy) });
                    chai_1.expect(state.energy.last_available_energy_float).to.be.below(1);
                    state = __1.play(state);
                    chai_1.expect(state.last_adventure).not.to.be.null;
                    chai_1.expect(state.last_adventure.good).to.be.false;
                    // again
                    state = __1.play(state);
                    chai_1.expect(state.last_adventure).not.to.be.null;
                    chai_1.expect(state.last_adventure.good).to.be.false;
                });
                it('should not decrease user stats');
                it('should correctly increment counters', () => {
                    let state = __1.create();
                    state = Object.assign({}, state, { energy: EnergyState.loose_all_energy(state.energy) });
                    state = __1.play(state);
                    chai_1.expect(state).to.have.nested.property('progress.statistics.bad_play_count', 1);
                    chai_1.expect(state).to.have.nested.property('progress.statistics.bad_play_count_by_active_class.novice', 1);
                    state = __1.play(state);
                    chai_1.expect(state).to.have.nested.property('progress.statistics.bad_play_count', 2);
                    chai_1.expect(state).to.have.nested.property('progress.statistics.bad_play_count_by_active_class.novice', 2);
                });
                it('should punish a bit the user (ex. by increasing the cooldown)', () => {
                    let state = __1.create();
                    state = Object.assign({}, state, { energy: EnergyState.loose_all_energy(state.energy) });
                    // force (for tests)
                    state.energy.last_available_energy_float = .8;
                    state = __1.play(state);
                    chai_1.expect(state.last_adventure).not.to.be.null;
                    chai_1.expect(state.last_adventure.good).to.be.false;
                    chai_1.expect(state.energy.last_available_energy_float).to.be.below(0.0001);
                });
                it('may actually result in a good outcome (idea TODO)');
            });
            context('✅  when allowed (the cooldown has passed / enough energy)', function () {
                it('should sometime generate a story adventure', () => {
                    const state = __1.play(__1.create());
                    chai_1.expect(state.last_adventure).not.to.be.null;
                    chai_1.expect(state.last_adventure.good).to.be.true;
                });
                it('should correctly increment counters', () => {
                    let state = __1.play(__1.create());
                    chai_1.expect(state).to.have.nested.property('progress.statistics.good_play_count', 1);
                    chai_1.expect(state).to.have.nested.property('progress.statistics.good_play_count_by_active_class.novice', 1);
                    state = __1.play(state);
                    chai_1.expect(state).to.have.nested.property('progress.statistics.good_play_count', 2);
                    chai_1.expect(state).to.have.nested.property('progress.statistics.good_play_count_by_active_class.novice', 2);
                });
                it('should sometime generate a fight adventure', () => {
                    let fightCount = 0;
                    let state = __1.create();
                    for (let i = 0; i < 100; ++i) {
                        state.energy.last_available_energy_float = 7.; // for tests
                        state = __1.play(state);
                        if (state.last_adventure.hid.startsWith('fight_'))
                            fightCount++;
                    }
                    //const EXPECTED_FIGHT_ENCOUNTER_RATIO = 0.33
                    chai_1.expect(fightCount).to.be.above(10);
                    chai_1.expect(fightCount).to.be.below(50);
                });
                context('when the adventure is a story', function () {
                    describe('the outcome', function () {
                        it('should sometime be a coin gain', () => {
                            let state = __1.create();
                            state = __1.play(state, 'dying_man');
                            // we got money
                            chai_1.expect(state_wallet_1.get_currency_amount(state.wallet, state_wallet_1.Currency.coin)).to.be.above(0);
                        });
                        it('should sometime be a token gain');
                        it('should sometime be a stat gain');
                        it('should sometime be an item gain', () => {
                            let state = __1.create();
                            state = __1.play(state, 'rare_goods_seller');
                            // check our 2 predefined items are still present and equipped
                            chai_1.expect(state_inventory_1.get_equipped_item_count(state.inventory), 'equipped').to.equal(2);
                            // a new item is present
                            chai_1.expect(state_inventory_1.get_unequipped_item_count(state.inventory), 'unequipped').to.equal(1);
                            // it's a weapon !
                            chai_1.expect(state.inventory.unslotted[0]).to.have.property('slot', 'armor');
                        });
                        it('should sometime be an item improvement');
                    });
                });
                context('when the adventure is a fight', function () {
                    it('should generate a suitable enemy', () => {
                        let state = __1.create();
                        state.avatar.attributes.level = 500;
                        for (let i = 0; i < 100; ++i) {
                            state.energy.last_available_energy_float = 7.; // for tests
                            state = __1.play(state);
                            if (state.last_adventure.hid.startsWith('fight_'))
                                break;
                        }
                        //console.log(state.last_adventure)
                        chai_1.expect(state.last_adventure, 'fight adventure').to.exist;
                        chai_1.expect(state.last_adventure.encounter, 'encounter field').to.exist;
                        chai_1.expect(state.last_adventure.encounter.level).to.be.within(400, 600);
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
    describe('adventures', function () {
        logic_adventures_1.ALL_ADVENTURE_ARCHETYPES.forEach(({ hid, good }) => {
            describe(`${good ? '✅' : '🚫'}  adventure "${hid}"`, function () {
                it('should be playable', () => {
                    let state = __1.create();
                    if (!good) {
                        // force deplete energy
                        state = Object.assign({}, state, { energy: EnergyState.loose_all_energy(state.energy) });
                    }
                    state = __1.play(state, hid);
                });
            });
        });
    });
});
//# sourceMappingURL=state_spec.js.map