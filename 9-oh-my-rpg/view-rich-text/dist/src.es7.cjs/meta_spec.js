"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_meta_1 = require("@oh-my-rpg/state-meta");
const { rich_text_to_ansi } = require('../../../the-npm-rpg/src/utils/rich_text_to_ansi');
const _1 = require(".");
describe('🗿 👻  meta rendering', function () {
    describe('demo', function () {
        it('shows off', () => {
            const doc = _1.render_account_info(state_meta_1.DEMO_STATE);
            //console.log(prettify_json(doc))
            console.log(rich_text_to_ansi(doc));
        });
    });
});
//# sourceMappingURL=meta_spec.js.map