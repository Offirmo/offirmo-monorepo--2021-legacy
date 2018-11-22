"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const strip_ansi = require('strip-ansi');
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_adventures_1 = require("@oh-my-rpg/logic-adventures");
const state_the_boring_rpg_1 = require("@oh-my-rpg/state-the-boring-rpg");
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi');
const _1 = require(".");
describe('🔠  view to @offirmo/rich-text-format - adventure', function () {
    it('should render properly - with gain of skills', () => {
        const $doc = _1.render_adventure(state_the_boring_rpg_1.DEMO_ADVENTURE_01);
        //console.log(prettify_json($doc))
        const str = strip_ansi(rich_text_to_ansi($doc));
        //console.log(str)
        chai_1.expect(str).to.be.a('string');
        chai_1.expect(str).to.include('You were attacked and nearly killed');
        chai_1.expect(str).to.include('L7');
        chai_1.expect(str).to.include('elite');
        chai_1.expect(str).to.include('chicken');
        chai_1.expect(str).to.include('+1 luck!');
    });
    it('should render properly - with gain of coins', () => {
        const $doc = _1.render_adventure(state_the_boring_rpg_1.DEMO_ADVENTURE_02);
        //console.log(prettify_json($doc))
        const str = strip_ansi(rich_text_to_ansi($doc));
        //console.log(str)
        chai_1.expect(str).to.be.a('string');
        chai_1.expect(str).to.include('A dying man on the street left you everything he had.');
        chai_1.expect(str).to.include('You gain');
        chai_1.expect(str).to.include('1234 coins');
    });
    it('should render properly - with gain of item(s)', () => {
        const $doc = _1.render_adventure(state_the_boring_rpg_1.DEMO_ADVENTURE_03);
        //console.log(prettify_json($doc))
        const str = strip_ansi(rich_text_to_ansi($doc));
        //console.log(str)
        chai_1.expect(str).to.be.a('string');
        chai_1.expect(str).to.include('You come across an old man with eccentric apparel');
        chai_1.expect(str).to.include('Adjudicator’s Admirable Axe');
    });
    it('should render properly - with gain of item improvement', () => {
        const $doc = _1.render_adventure(state_the_boring_rpg_1.DEMO_ADVENTURE_04);
        //console.log(prettify_json($doc))
        const str = strip_ansi(rich_text_to_ansi($doc));
        //console.log(str)
        chai_1.expect(str).to.be.a('string');
        chai_1.expect(str).to.include('You won’t take back the princess!');
        chai_1.expect(str).to.include('123 coins');
        chai_1.expect(str).to.include('enchant');
    });
    describe('adventures', function () {
        beforeEach(() => state_prng_1.xxx_internal_reset_prng_cache());
        logic_adventures_1.ALL_GOOD_ADVENTURE_ARCHETYPES
            .forEach(({ hid, good }, index) => {
            describe(`✅  adventure #${index} "${hid}"`, function () {
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
        logic_adventures_1.ALL_BAD_ADVENTURE_ARCHETYPES
            .forEach(({ hid, good }, index) => {
            describe(`❎  adventure #${index} "${hid}"`, function () {
                it('should be playable', () => {
                    let state = state_the_boring_rpg_1.create();
                    state = state_the_boring_rpg_1.play(state);
                    state = state_the_boring_rpg_1.play(state);
                    state = state_the_boring_rpg_1.play(state);
                    state = state_the_boring_rpg_1.play(state);
                    state = state_the_boring_rpg_1.play(state);
                    state = state_the_boring_rpg_1.play(state);
                    state = state_the_boring_rpg_1.play(state);
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