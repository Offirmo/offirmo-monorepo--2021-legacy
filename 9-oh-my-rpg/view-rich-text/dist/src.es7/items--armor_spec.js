import { expect } from 'chai';
import * as RichText from '@offirmo/rich-text-format';
import { generate_random_demo_armor, DEMO_ARMOR_1, DEMO_ARMOR_2 } from '@oh-my-rpg/logic-armors';
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi');
const prettyjson = require('prettyjson');
function prettify_json(data, options = {}) {
    return prettyjson.render(data, options);
}
import { render_armor_detailed } from '.';
describe('🛡  armor rendering', function () {
    context('when not enhanced', function () {
        it('should render properly', () => {
            const $doc = render_armor_detailed(DEMO_ARMOR_1);
            const str = RichText.to_text($doc);
            expect(str).to.be.a('string');
            expect(str).to.include('Armguards');
            expect(str).to.include('Of the ancients');
            expect(str).to.include('Bone');
            expect(str).not.to.include('+');
        });
    });
    context('when enhanced', function () {
        it('should render properly', () => {
            const $doc = render_armor_detailed(DEMO_ARMOR_2);
            const str = RichText.to_text($doc);
            expect(str).to.be.a('string');
            expect(str).to.include('Belt');
            expect(str).to.include('Brass');
            expect(str).to.include('Apprentice’s');
            expect(str).to.include('+8');
        });
    });
    describe('demos', function () {
        it('shows off armors', () => {
            const doc2 = render_armor_detailed(DEMO_ARMOR_2);
            //console.log(prettify_json(doc2))
            console.log(rich_text_to_ansi(doc2));
            const doc1 = render_armor_detailed(DEMO_ARMOR_1);
            //console.log(prettify_json(doc1))
            console.log(rich_text_to_ansi(doc1));
            for (let i = 0; i < 10; ++i) {
                const item = generate_random_demo_armor();
                const doc = render_armor_detailed(item);
                //console.log(prettify_json(doc))
                console.log(rich_text_to_ansi(doc));
            }
        });
    });
});
//# sourceMappingURL=items--armor_spec.js.map