"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_character_1 = require("@oh-my-rpg/state-character");
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi');
const _1 = require(".");
describe('🔠  view to @offirmo/rich-text-format - attributes', function () {
    describe('full character sheet rendering', function () {
        describe('demo', function () {
            it('shows off', () => {
                const $doc = _1.render_character_sheet(state_character_1.DEMO_STATE);
                const str = rich_text_to_ansi($doc);
                // should just not throw
            });
        });
    });
});
//# sourceMappingURL=attributes_spec.js.map