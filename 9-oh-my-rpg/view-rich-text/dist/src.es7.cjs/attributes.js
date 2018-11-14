"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const state_character_1 = require("@oh-my-rpg/state-character");
function render_avatar(state) {
    // TODO refactor
    const $doc_name = RichText.inline_fragment().addClass('avatar__name').pushText(state.name).done();
    const $doc_class = RichText.inline_fragment().addClass('avatar__class').pushText(state.klass).done();
    const $doc = RichText.block_fragment()
        .pushHeading('Identity:', { id: 'header' })
        .pushNode(RichText.unordered_list()
        .pushKeyValue('name', $doc_name)
        .pushKeyValue('class', $doc_class)
        .done())
        .done();
    return $doc;
}
exports.render_avatar = render_avatar;
function render_attributes(state) {
    const $doc_list = RichText.unordered_list()
        .addClass('attributes')
        .done();
    // TODO better sort
    state_character_1.CHARACTER_ATTRIBUTES_SORTED.forEach((stat, index) => {
        const label = stat;
        const value = state.attributes[stat];
        const $doc_attr = RichText.key_value(label, `${value}`).done();
        $doc_list.$sub[`000${index}`.slice(-3)] = $doc_attr;
    });
    const $doc = RichText.block_fragment()
        .pushNode(RichText.heading().pushText('Attributes:').done(), { id: 'header' })
        .pushNode($doc_list, { id: 'list' })
        .done();
    return $doc;
}
exports.render_attributes = render_attributes;
function render_character_sheet(state) {
    const $doc = RichText.block_fragment()
        .pushNode(render_avatar(state), { id: 'avatar' })
        .pushNode(render_attributes(state), { id: 'attributes' })
        .done();
    return $doc;
}
exports.render_character_sheet = render_character_sheet;
//# sourceMappingURL=attributes.js.map