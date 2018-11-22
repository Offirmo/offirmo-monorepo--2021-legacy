"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi');
const _1 = require(".");
describe('🔠  view to @offirmo/rich-text-format - armor', function () {
    context('when not enhanced', function () {
        it('should render properly', () => {
            const $doc = _1.render_armor_detailed(logic_armors_1.DEMO_ARMOR_1);
            const str = RichText.to_text($doc);
            chai_1.expect(str).to.be.a('string');
            chai_1.expect(str).to.include('Armguards');
            chai_1.expect(str).to.include('Of the ancients');
            chai_1.expect(str).to.include('Bone');
            chai_1.expect(str).not.to.include('+');
        });
    });
    context('when enhanced', function () {
        it('should render properly', () => {
            const $doc = _1.render_armor_detailed(logic_armors_1.DEMO_ARMOR_2);
            const str = RichText.to_text($doc);
            chai_1.expect(str).to.be.a('string');
            chai_1.expect(str).to.include('Belt');
            chai_1.expect(str).to.include('Brass');
            chai_1.expect(str).to.include('Apprentice’s');
            chai_1.expect(str).to.include('+8');
        });
    });
    describe('demos', function () {
        it('shows off armors', () => {
            const doc1 = _1.render_armor_detailed(logic_armors_1.DEMO_ARMOR_1);
            //console.log(prettify_json(doc1))
            let str = rich_text_to_ansi(doc1);
            // should just not throw
            const doc2 = _1.render_armor_detailed(logic_armors_1.DEMO_ARMOR_2);
            //console.log(prettify_json(doc2))
            str = rich_text_to_ansi(doc2);
            // should just not throw
            for (let i = 0; i < 10; ++i) {
                const item = logic_armors_1.generate_random_demo_armor();
                const $doc = _1.render_armor_detailed(item);
                //console.log(prettify_json($doc))
                const str = rich_text_to_ansi($doc);
                // should just not throw
            }
        });
    });
});
//# sourceMappingURL=items--armor_spec.js.map