import { expect } from 'chai';
import * as RichText from '@offirmo/rich-text-format';
import { generate_random_demo_weapon, DEMO_WEAPON_1, DEMO_WEAPON_2 } from '@oh-my-rpg/logic-weapons';
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi');
const prettyjson = require('prettyjson');
function prettify_json(data, options = {}) {
    return prettyjson.render(data, options);
}
import { render_weapon_detailed } from '.';
describe('⚔  weapon rendering', function () {
    context('when not enhanced', function () {
        it('should render properly', () => {
            const $doc = render_weapon_detailed(DEMO_WEAPON_1);
            const str = RichText.to_text($doc);
            expect(str).to.be.a('string');
            expect(str).to.include('Axe');
            expect(str).to.include('Admirable');
            expect(str).to.include('Adjudicator’s');
            expect(str).not.to.include('+');
        });
    });
    context('when enhanced', function () {
        it('should render properly', () => {
            const $doc = render_weapon_detailed(DEMO_WEAPON_2);
            const str = RichText.to_text($doc);
            expect(str).to.be.a('string');
            expect(str).to.include('Bow');
            expect(str).to.include('Arcanic');
            expect(str).to.include('Ambassador’s');
            expect(str).to.include('+8');
        });
    });
    describe('demos', function () {
        it('shows off weapons', () => {
            const doc2 = render_weapon_detailed(DEMO_WEAPON_2);
            //console.log(prettify_json(doc2))
            console.log(rich_text_to_ansi(doc2));
            const doc1 = render_weapon_detailed(DEMO_WEAPON_1);
            //console.log(prettify_json(doc1))
            console.log(rich_text_to_ansi(doc1));
            for (let i = 0; i < 10; ++i) {
                const item = generate_random_demo_weapon();
                const doc = render_weapon_detailed(item);
                //console.log(prettify_json(doc))
                console.log(rich_text_to_ansi(doc));
            }
        });
    });
});
//# sourceMappingURL=items--weapon_spec.js.map