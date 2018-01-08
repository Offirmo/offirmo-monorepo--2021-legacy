"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logic_monsters_1 = require("@oh-my-rpg/logic-monsters");
const { rich_text_to_ansi } = require('../../../the-npm-rpg/src/utils/rich_text_to_ansi');
const _1 = require(".");
describe('🗿 👻  monster rendering', function () {
    describe('demo', function () {
        it('shows off', () => {
            for (let i = 0; i < 10; ++i) {
                const m = logic_monsters_1.generate_random_demo_monster();
                const doc = _1.render_monster(m);
                //console.log(prettify_json(doc))
                console.log(rich_text_to_ansi(doc));
            }
        });
    });
});
//# sourceMappingURL=monster_spec.js.map