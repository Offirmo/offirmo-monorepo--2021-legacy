"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const state_character_1 = require("@oh-my-rpg/state-character");
function render_avatar(state) {
    // TODO refactor
    const $doc = RichText.block_fragment()
        .pushNode(RichText.heading().pushText('Identity:{{br}}').done(), 'header')
        .pushText('name:  {{name}}{{br}}')
        .pushText('class: {{class}}')
        .pushRawNode(RichText.span().addClass('avatar__name').pushText(state.name).done(), 'name')
        .pushRawNode(RichText.span().addClass('avatar__class').pushText(state.klass).done(), 'class')
        .done();
    return $doc;
}
exports.render_avatar = render_avatar;
function render_attributes(state) {
    const $doc_list = RichText.unordered_list()
        .addClass('attributes')
        .done();
    // TODO better sort
    // TODO KV
    state_character_1.CHARACTER_ATTRIBUTES_SORTED.forEach((stat, index) => {
        const label = stat;
        const value = state.attributes[stat];
        const padded_label = `${label}............`.slice(0, 11);
        const padded_human_value = `.......${value}`.slice(-4);
        const $doc_item = RichText.span()
            .addClass('attribute--' + stat)
            .pushText(padded_label + padded_human_value)
            .done();
        $doc_list.$sub['' + index] = $doc_item;
    });
    const $doc = RichText.block_fragment()
        .pushNode(RichText.heading().pushText('Attributes:').done(), 'header')
        .pushNode($doc_list, 'list')
        .done();
    return $doc;
}
exports.render_attributes = render_attributes;
function render_character_sheet(state) {
    const $doc = RichText.block_fragment()
        .pushNode(render_avatar(state), 'avatar')
        //.pushLineBreak()
        .pushNode(render_attributes(state), 'attributes')
        .done();
    return $doc;
}
exports.render_character_sheet = render_character_sheet;
//# sourceMappingURL=attributes.js.map