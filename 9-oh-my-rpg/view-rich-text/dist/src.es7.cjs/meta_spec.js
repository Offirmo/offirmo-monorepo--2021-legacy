"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_meta_1 = require("@oh-my-rpg/state-meta");
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi');
const _1 = require(".");
describe('🔠  view to @offirmo/rich-text-format - meta', function () {
    describe('demo', function () {
        it('shows off', () => {
            const $doc = _1.render_account_info(state_meta_1.DEMO_STATE);
            //console.log(prettify_json($doc))
            const str = rich_text_to_ansi($doc);
            // should just not throw
        });
    });
});
//# sourceMappingURL=meta_spec.js.map