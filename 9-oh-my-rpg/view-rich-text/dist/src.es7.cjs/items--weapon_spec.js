"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi');
const _1 = require(".");
describe('🔠  view to @offirmo/rich-text-format -  weapon', function () {
    context('when not enhanced', function () {
        it('should render properly', () => {
            const $doc = _1.render_weapon_detailed(logic_weapons_1.DEMO_WEAPON_1);
            const str = RichText.to_text($doc);
            chai_1.expect(str).to.be.a('string');
            chai_1.expect(str).to.include('Axe');
            chai_1.expect(str).to.include('Admirable');
            chai_1.expect(str).to.include('Adjudicator’s');
            chai_1.expect(str).not.to.include('+');
        });
    });
    context('when enhanced', function () {
        it('should render properly', () => {
            const $doc = _1.render_weapon_detailed(logic_weapons_1.DEMO_WEAPON_2);
            const str = RichText.to_text($doc);
            chai_1.expect(str).to.be.a('string');
            chai_1.expect(str).to.include('Bow');
            chai_1.expect(str).to.include('Arcanic');
            chai_1.expect(str).to.include('Ambassador’s');
            chai_1.expect(str).to.include('+8');
        });
    });
    describe('demos', function () {
        it('shows off weapons', () => {
            const doc1 = _1.render_weapon_detailed(logic_weapons_1.DEMO_WEAPON_1, 2000);
            //console.log(prettify_json(doc1))
            let str = rich_text_to_ansi(doc1);
            // should just not throw
            const doc2 = _1.render_weapon_detailed(logic_weapons_1.DEMO_WEAPON_2, 2000);
            //console.log(prettify_json(doc2))
            str = rich_text_to_ansi(doc2);
            // should just not throw
            for (let i = 0; i < 10; ++i) {
                const item = logic_weapons_1.generate_random_demo_weapon();
                const $doc = _1.render_weapon_detailed(item, 2000);
                //console.log(prettify_json($doc))
                const str = rich_text_to_ansi($doc);
                // should just not throw
            }
        });
    });
});
//# sourceMappingURL=items--weapon_spec.js.map