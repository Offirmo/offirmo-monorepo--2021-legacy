"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logic_monsters_1 = require("@oh-my-rpg/logic-monsters");
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi');
const _1 = require(".");
describe('🔠  view to @offirmo/rich-text-format - monster', function () {
    describe('demo', function () {
        it('shows off', () => {
            for (let i = 0; i < 10; ++i) {
                const m = logic_monsters_1.generate_random_demo_monster();
                const $doc = _1.render_monster(m);
                //console.log(prettify_json($doc))
                const str = rich_text_to_ansi($doc);
                // should just not throw
            }
        });
    });
});
//# sourceMappingURL=monster_spec.js.map