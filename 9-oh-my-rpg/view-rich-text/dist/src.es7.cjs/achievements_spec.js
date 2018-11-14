"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const strip_ansi = require('strip-ansi');
const state_the_boring_rpg_1 = require("@oh-my-rpg/state-the-boring-rpg");
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi');
const _1 = require(".");
const prettyjson = require('prettyjson');
function prettify_json(data, options = {}) {
    return prettyjson.render(data, options);
}
describe('🔠  view to @offirmo/rich-text-format - achievements', function () {
    it.only('should render properly - demo', () => {
        const state = state_the_boring_rpg_1.play(state_the_boring_rpg_1.create());
        const $doc = _1.render_achievements_snapshot(state_the_boring_rpg_1.get_achievements_snapshot(state));
        //console.log(prettify_json($doc))
        const str = rich_text_to_ansi($doc);
        console.log(str);
        chai_1.expect(str).to.be.a('string');
    });
});
//# sourceMappingURL=achievements_spec.js.map