"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
function render_monster(m) {
    const $doc = RichText.inline_fragment()
        .addClass('monster', 'monster--rank--' + m.rank)
        .pushText('{{level}} {{rank}} {{name||Capitalize}}')
        .pushRawNode(RichText.inline_fragment().pushText('L').pushText('' + m.level).done(), { id: 'level' })
        .pushRawNode(RichText.inline_fragment().addClass('rank--' + m.rank).pushText(m.rank).done(), { id: 'rank' })
        .pushRawNode(RichText.inline_fragment().addClass('monster__name').pushText(m.name).done(), { id: 'name' })
        .addHints({ possible_emoji: m.possible_emoji })
        .done();
    return $doc;
}
exports.render_monster = render_monster;
//# sourceMappingURL=monster.js.map