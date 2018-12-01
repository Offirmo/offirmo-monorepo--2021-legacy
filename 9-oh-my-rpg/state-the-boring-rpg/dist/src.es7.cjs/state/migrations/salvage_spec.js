"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
const state_prng_1 = require("@oh-my-rpg/state-prng");
const consts_1 = require("../../consts");
const salvage_1 = require("./salvage");
const examples_1 = require("../../examples");
describe(`${consts_1.LIB} - schema migration`, function () {
    beforeEach(() => state_prng_1.xxx_internal_reset_prng_cache());
    describe('salvaging an outdated savegame', () => {
        it('should be able to salvage a v4+ savegame', () => {
            const NAME = 'Perte';
            const CLASS = "paladin";
            const GOOD_PLAY_COUNT = 86;
            const BAD_PLAY_COUNT = 0;
            const PSEUDO_V4 = deep_freeze_strict_1.default({
                "schema_version": 4,
                "revision": 203,
                "avatar": {
                    "schema_version": 2,
                    "revision": 42,
                    "name": NAME,
                    "klass": CLASS,
                },
                "prng": {
                    "seed": 1234,
                },
                "click_count": GOOD_PLAY_COUNT + BAD_PLAY_COUNT,
                "good_click_count": GOOD_PLAY_COUNT,
                "meaningful_interaction_count": GOOD_PLAY_COUNT + BAD_PLAY_COUNT,
            });
            const salvaged_state = salvage_1.reset_and_salvage(PSEUDO_V4);
            chai_1.expect(salvaged_state.avatar.name).to.equal(NAME);
            chai_1.expect(salvaged_state.avatar.klass).to.equal(CLASS);
            chai_1.expect(salvaged_state.progress.statistics.good_play_count).to.equal(GOOD_PLAY_COUNT);
            chai_1.expect(salvaged_state.progress.statistics.bad_play_count).to.equal(BAD_PLAY_COUNT);
        });
        it('should be able to salvage a v6+ savegame', () => {
            const NAME = 'LiddiLidd';
            const CLASS = "warrior";
            const GOOD_PLAY_COUNT = 429;
            const BAD_PLAY_COUNT = 433 - 429;
            const PSEUDO_V4 = deep_freeze_strict_1.default({
                "schema_version": 6,
                "revision": 485,
                "uuid": "uu1EO9VgTjPlR1YPj0yfdWjG",
                "creation_date": "20180813_00h33",
                "avatar": {
                    "schema_version": 2,
                    "revision": 326,
                    "name": NAME,
                    "klass": CLASS,
                    "attributes": {
                        "level": 19,
                        "health": 51,
                        "mana": 41,
                        "strength": 83,
                        "agility": 30,
                        "charisma": 30,
                        "wisdom": 46,
                        "luck": 31
                    }
                },
                "prng": {
                    "schema_version": 2,
                    "revision": 452,
                    "seed": 1425674993,
                    "use_count": 2867,
                },
                "click_count": GOOD_PLAY_COUNT + BAD_PLAY_COUNT,
                "good_click_count": GOOD_PLAY_COUNT,
                "meaningful_interaction_count": GOOD_PLAY_COUNT + BAD_PLAY_COUNT,
            });
            const salvaged_state = salvage_1.reset_and_salvage(PSEUDO_V4);
            chai_1.expect(salvaged_state.avatar.name).to.equal(NAME);
            chai_1.expect(salvaged_state.avatar.klass).to.equal(CLASS);
            chai_1.expect(salvaged_state.progress.statistics.good_play_count).to.equal(GOOD_PLAY_COUNT);
            chai_1.expect(salvaged_state.progress.statistics.bad_play_count).to.equal(BAD_PLAY_COUNT);
        });
        it('should be able to salvage a v7+ savegame', () => {
            const salvaged_state = salvage_1.reset_and_salvage(examples_1.DEMO_STATE);
            chai_1.expect(salvaged_state.avatar.name).to.equal('Perte');
            chai_1.expect(salvaged_state.avatar.klass).to.equal("paladin");
            chai_1.expect(salvaged_state.progress.statistics.good_play_count).to.equal(12);
            chai_1.expect(salvaged_state.progress.statistics.bad_play_count).to.equal(3);
        });
        it('should be able to salvage total crap', () => {
            const salvaged_state = salvage_1.reset_and_salvage({ foo: 42 });
            chai_1.expect(salvaged_state.avatar.name.startsWith('A')).to.be.true;
            chai_1.expect(salvaged_state.avatar.klass).not.to.equal('novice');
            chai_1.expect(salvaged_state.progress.statistics.good_play_count, 'good').to.equal(1);
            chai_1.expect(salvaged_state.progress.statistics.bad_play_count, 'bad').to.equal(0);
        });
    });
});
//# sourceMappingURL=salvage_spec.js.map