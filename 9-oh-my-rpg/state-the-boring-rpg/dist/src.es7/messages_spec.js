import { expect } from 'chai';
import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng';
import * as RichText from '@offirmo/rich-text-format';
import { create, get_recap, get_tip, } from '.';
describe('@oh-my-rpg/state-the-boring-rpg - contextual messages', function () {
    beforeEach(() => xxx_internal_reset_prng_cache());
    describe('get recap', function () {
        context('when the user has just started a new game', function () {
            it('should return an intro', () => {
                const state = create();
                const doc = get_recap(state);
                const str = RichText.to_text(doc);
                expect(str).to.include('Congratulations, you were chosen');
            });
        });
        context('when the user has already played', function () {
            it('should recap current status');
        });
    });
    describe('get tip', function () {
        context('when the user has just started a new game', function () {
            it('should suggest to play', () => {
                const state = create();
                const doc = get_tip(state);
                const str = RichText.to_text(doc);
                //console.log(`"${str}"`)
                expect(str).to.include('Tip:');
                expect(str).to.include('Select play');
            });
        });
        context('when the user has already played', function () {
            context('when the user has an unequipped better weapon', function () {
                it('should suggest to install it');
            });
        });
        context('when none of the above', function () {
            it('should not suggest anything');
        });
    });
});
//# sourceMappingURL=messages_spec.js.map