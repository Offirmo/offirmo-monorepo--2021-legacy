"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const strip_ansi = require('strip-ansi');
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_adventures_1 = require("@oh-my-rpg/logic-adventures");
const state_the_boring_rpg_1 = require("@oh-my-rpg/state-the-boring-rpg");
const { rich_text_to_ansi } = require('../../../the-npm-rpg/src/utils/rich_text_to_ansi');
const _1 = require(".");
const prettyjson = require('prettyjson');
function prettify_json(data, options = {}) {
    return prettyjson.render(data, options);
}
describe('📃  adventure rendering', function () {
    it('should render properly - with gain of skills', () => {
        const $doc = _1.render_adventure(state_the_boring_rpg_1.DEMO_ADVENTURE_01);
        //console.log(prettify_json($doc))
        const str = strip_ansi(rich_text_to_ansi($doc));
        console.log(str);
        chai_1.expect(str).to.be.a('string');
        chai_1.expect(str).to.include('You were attacked and nearly killed');
        chai_1.expect(str).to.include('L7 elite★ chicken 🐓');
        chai_1.expect(str).to.include('+1 luck!');
        chai_1.expect(str).to.include('\nCharacter improvement:');
    });
    it('should render properly - with gain of coins', () => {
        const $doc = _1.render_adventure(state_the_boring_rpg_1.DEMO_ADVENTURE_02);
        //console.log(prettify_json($doc))
        const str = strip_ansi(rich_text_to_ansi($doc));
        console.log(str);
        chai_1.expect(str).to.be.a('string');
        chai_1.expect(str).to.include('A dying man on the street left you everything he had.');
        chai_1.expect(str).to.include('You gained');
        chai_1.expect(str).to.include('1234 coins');
        chai_1.expect(str).to.include('\nLoot:');
    });
    it('should render properly - with gain of item(s)', () => {
        const $doc = _1.render_adventure(state_the_boring_rpg_1.DEMO_ADVENTURE_03);
        //console.log(prettify_json($doc))
        const str = strip_ansi(rich_text_to_ansi($doc));
        console.log(str);
        chai_1.expect(str).to.be.a('string');
        chai_1.expect(str).to.include('You come across an old man with eccentric apparel');
        chai_1.expect(str).to.include('\nLoot:\n - ⚔  uncommon Adjudicator’s Admirable Axe [19 ↔ 133]');
    });
    it('should render properly - with gain of item improvement', () => {
        const $doc = _1.render_adventure(state_the_boring_rpg_1.DEMO_ADVENTURE_04);
        //console.log(prettify_json($doc))
        const str = strip_ansi(rich_text_to_ansi($doc));
        console.log(str);
        chai_1.expect(str).to.be.a('string');
        chai_1.expect(str).to.include('You won\'t take back the princess!');
        chai_1.expect(str).to.include('\nLoot:\n - 💰  123 coins');
        chai_1.expect(str).to.include('\nItem improvement:');
    });
    describe('adventures', function () {
        beforeEach(() => state_prng_1.xxx_internal_reset_prng_cache());
        logic_adventures_1.ALL_GOOD_ADVENTURE_ARCHETYPES
            .forEach(({ hid, good }, index) => {
            describe(`${good ? '✅' : '🚫'}  adventure #${index} "${hid}"`, function () {
                it('should be playable', () => {
                    let state = state_the_boring_rpg_1.create();
                    state = state_the_boring_rpg_1.play(state, hid);
                    const $doc = _1.render_adventure(state.last_adventure);
                    //console.log(prettify_json($doc))
                    const str = rich_text_to_ansi($doc);
                    //console.log(str)
                    // should just not throw
                });
            });
        });
    });
});
//# sourceMappingURL=adventure_spec.js.map