"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const state_prng_1 = require("@oh-my-rpg/state-prng");
const RichText = require("@offirmo/rich-text-format");
const _1 = require(".");
describe('⚔ 👑 😪  The Boring RPG - contextual messages', function () {
    beforeEach(() => state_prng_1.xxx_internal_reset_prng_cache());
    describe('get recap', function () {
        context('when the user has just started a new game', function () {
            it('should return an intro', () => {
                const state = _1.create();
                const doc = _1.get_recap(state);
                const str = RichText.to_text(doc);
                chai_1.expect(str).to.include('Congratulations, adventurer from another world!');
            });
        });
        context('when the user has already played', function () {
            it('should recap current status');
        });
    });
    describe('get tip', function () {
        context('when the user has just started a new game', function () {
            it('should suggest to play', () => {
                const state = _1.create();
                const doc = _1.get_tip(state);
                const str = RichText.to_text(doc);
                //console.log(`"${str}"`)
                chai_1.expect(str).to.include('Tip:');
                chai_1.expect(str).to.include('Select play');
            });
        });
        context('when the user has already played', function () {
            context('when the user has an unequiped better weapon', function () {
                it('should suggest to install it');
            });
        });
        context('when none of the above', function () {
            it('should not suggest anything');
        });
    });
});
//# sourceMappingURL=messages_spec.js.map