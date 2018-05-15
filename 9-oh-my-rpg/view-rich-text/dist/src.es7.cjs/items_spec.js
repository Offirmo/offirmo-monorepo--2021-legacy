"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const { rich_text_to_ansi } = require('../../../../apps/the-npm-rpg/src/utils/rich_text_to_ansi');
const prettyjson = require('prettyjson');
function prettify_json(data, options = {}) {
    return prettyjson.render(data, options);
}
const _1 = require(".");
describe('⚔ 🛡 item rendering', function () {
    describe('⚔  weapon rendering', function () {
        context('when not enhanced', function () {
            it('should render properly', () => {
                const $doc = _1.render_weapon(logic_weapons_1.DEMO_WEAPON_1);
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
                const $doc = _1.render_weapon(logic_weapons_1.DEMO_WEAPON_2);
                const str = RichText.to_text($doc);
                chai_1.expect(str).to.be.a('string');
                chai_1.expect(str).to.include('Bow');
                chai_1.expect(str).to.include('Arcanic');
                chai_1.expect(str).to.include('Ambassador’s');
                chai_1.expect(str).to.include('+8');
            });
        });
    });
    describe('🛡  armor rendering', function () {
        context('when not enhanced', function () {
            it('should render properly', () => {
                const $doc = _1.render_armor(logic_armors_1.DEMO_ARMOR_1);
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
                const $doc = _1.render_armor(logic_armors_1.DEMO_ARMOR_2);
                const str = RichText.to_text($doc);
                chai_1.expect(str).to.be.a('string');
                chai_1.expect(str).to.include('Belt');
                chai_1.expect(str).to.include('Brass');
                chai_1.expect(str).to.include('Apprentice’s');
                chai_1.expect(str).to.include('+8');
            });
        });
    });
    describe('demos', function () {
        it('shows off weapons', () => {
            const doc2 = _1.render_weapon(logic_weapons_1.DEMO_WEAPON_2);
            //console.log(prettify_json(doc2))
            console.log(rich_text_to_ansi(doc2));
            const doc1 = _1.render_weapon(logic_weapons_1.DEMO_WEAPON_1);
            //console.log(prettify_json(doc1))
            console.log(rich_text_to_ansi(doc1));
            for (let i = 0; i < 10; ++i) {
                const item = logic_weapons_1.generate_random_demo_weapon();
                const doc = _1.render_weapon(item);
                //console.log(prettify_json(doc))
                console.log(rich_text_to_ansi(doc));
            }
        });
        it('shows off armors', () => {
            const doc2 = _1.render_armor(logic_armors_1.DEMO_ARMOR_2);
            //console.log(prettify_json(doc2))
            console.log(rich_text_to_ansi(doc2));
            const doc1 = _1.render_armor(logic_armors_1.DEMO_ARMOR_1);
            //console.log(prettify_json(doc1))
            console.log(rich_text_to_ansi(doc1));
            for (let i = 0; i < 10; ++i) {
                const item = logic_armors_1.generate_random_demo_armor();
                const doc = _1.render_armor(item);
                //console.log(prettify_json(doc))
                console.log(rich_text_to_ansi(doc));
            }
        });
    });
});
//# sourceMappingURL=items_spec.js.map