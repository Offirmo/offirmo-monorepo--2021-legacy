import { expect } from 'chai';
import deepFreeze from 'deep-freeze-strict';
import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng';
import { LIB } from '../../consts';
import { reset_and_salvage } from './salvage';
import { DEMO_STATE } from '../../examples';
describe(`${LIB} - schema migration`, function () {
    beforeEach(() => xxx_internal_reset_prng_cache());
    describe('salvaging an outdated savegame', () => {
        it('should be able to salvage a v4+ savegame', () => {
            const NAME = 'Perte';
            const CLASS = "paladin";
            const GOOD_PLAY_COUNT = 86;
            const BAD_PLAY_COUNT = 0;
            const PSEUDO_V4 = deepFreeze({
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
            const salvaged_state = reset_and_salvage(PSEUDO_V4);
            expect(salvaged_state.avatar.name).to.equal(NAME);
            expect(salvaged_state.avatar.klass).to.equal(CLASS);
            expect(salvaged_state.progress.statistics.good_play_count).to.equal(GOOD_PLAY_COUNT);
            expect(salvaged_state.progress.statistics.bad_play_count).to.equal(BAD_PLAY_COUNT);
        });
        it('should be able to salvage a v6+ savegame', () => {
            const NAME = 'LiddiLidd';
            const CLASS = "warrior";
            const GOOD_PLAY_COUNT = 429;
            const BAD_PLAY_COUNT = 433 - 429;
            const PSEUDO_V4 = deepFreeze({
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
            const salvaged_state = reset_and_salvage(PSEUDO_V4);
            expect(salvaged_state.avatar.name).to.equal(NAME);
            expect(salvaged_state.avatar.klass).to.equal(CLASS);
            expect(salvaged_state.progress.statistics.good_play_count).to.equal(GOOD_PLAY_COUNT);
            expect(salvaged_state.progress.statistics.bad_play_count).to.equal(BAD_PLAY_COUNT);
        });
        it('should be able to salvage a v7+ savegame', () => {
            const salvaged_state = reset_and_salvage(DEMO_STATE);
            expect(salvaged_state.avatar.name).to.equal('Perte');
            expect(salvaged_state.avatar.klass).to.equal("paladin");
            expect(salvaged_state.progress.statistics.good_play_count).to.equal(12);
            expect(salvaged_state.progress.statistics.bad_play_count).to.equal(3);
        });
        it('should be able to salvage total crap', () => {
            const salvaged_state = reset_and_salvage({ foo: 42 });
            expect(salvaged_state.avatar.name.startsWith('A')).to.be.true;
            expect(salvaged_state.avatar.klass).not.to.equal('novice');
            expect(salvaged_state.progress.statistics.good_play_count, 'good').to.equal(1);
            expect(salvaged_state.progress.statistics.bad_play_count, 'bad').to.equal(0);
        });
    });
});
//# sourceMappingURL=salvage_spec.js.map