"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const prettify_json_1 = require("@offirmo/prettify-json");
const definitions_1 = require("@oh-my-rpg/definitions");
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const consts_1 = require("../../consts");
const selectors_1 = require("../../selectors");
const create_1 = require("./create");
const autoplay_1 = require("./autoplay");
describe(`${consts_1.LIB} - reducer`, function () {
    beforeEach(() => state_prng_1.xxx_internal_reset_prng_cache());
    describe('autoplay', function () {
        it('should allow playing a huge number of time (interface 1)', () => {
            let state = create_1.create();
            try {
                for (let i = 0; i < 1000; ++i) {
                    state = autoplay_1.autoplay(state, { DEBUG: false });
                }
            }
            catch (err) {
                prettify_json_1.dump_pretty_json('crash', state);
                throw err;
            }
            //dump_pretty_json('success', state)
            chai_1.expect(state.progress.statistics.good_play_count).to.equal(1000);
            chai_1.expect(state.progress.statistics.bad_play_count).to.equal(0);
        });
        it('should automatically make good decisions (interface 2)', () => {
            let state = create_1.create();
            try {
                state = autoplay_1.autoplay(state, {
                    target_good_play_count: 1000,
                });
            }
            catch (err) {
                prettify_json_1.dump_pretty_json('crash', state);
                throw err;
            }
            //dump_pretty_json('success', state)
            chai_1.expect(state.avatar.klass).not.to.equal('novice');
            chai_1.expect(selectors_1.is_inventory_full(state)).to.be.false;
            const equipped_armor = state.inventory.slotted[definitions_1.InventorySlot.armor];
            const equipped_weapon = state.inventory.slotted[definitions_1.InventorySlot.weapon];
            chai_1.expect(logic_armors_1.matches(equipped_armor, create_1.STARTING_ARMOR_SPEC)).to.be.false;
            chai_1.expect(logic_weapons_1.matches(equipped_weapon, create_1.STARTING_WEAPON_SPEC)).to.be.false;
        });
        it('should allow auto-looping with good and bad (interface 2)', () => {
            let state = create_1.create();
            try {
                state = autoplay_1.autoplay(state, {
                    target_good_play_count: 2000,
                    target_bad_play_count: 100,
                });
            }
            catch (err) {
                prettify_json_1.dump_pretty_json('crash', state);
                throw err;
            }
            //dump_pretty_json('success', state)
            chai_1.expect(state.progress.statistics.good_play_count).to.equal(2000);
            chai_1.expect(state.progress.statistics.bad_play_count).to.equal(100);
        });
    });
});
//# sourceMappingURL=autoplay_spec.js.map