"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const definitions_1 = require("@oh-my-rpg/definitions");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const logic_armors_2 = require("@oh-my-rpg/logic-armors");
const consts_1 = require("./consts");
function render_armor_name(i) {
    const _ = logic_armors_2.i18n_messages.en;
    const b = _.armor.base[i.base_hid];
    const q1 = _.armor.qualifier1[i.qualifier1_hid];
    const q2 = _.armor.qualifier2[i.qualifier2_hid];
    const builder = RichText.span()
        .addClass('item__name')
        .pushText(q2.startsWith('of')
        ? '{{q1|Capitalize}} {{base|Capitalize}} {{q2|Capitalize}}'
        : '{{q2|Capitalize}} {{q1|Capitalize}} {{base|Capitalize}}');
    if (i.enhancement_level) {
        const $node_enhancement = RichText.span()
            .addClass('item--enhancement')
            .pushText(`+${i.enhancement_level}`)
            .done();
        builder.pushText(' ').pushNode($node_enhancement, 'enhancement');
    }
    const $doc = builder.done();
    $doc.$sub.base = RichText.span().pushText(b).done();
    $doc.$sub.q1 = RichText.span().pushText(q1).done();
    $doc.$sub.q2 = RichText.span().pushText(q2).done();
    return $doc;
}
function render_armor(i, options = consts_1.DEFAULT_RENDER_ITEM_OPTIONS) {
    if (i.slot !== definitions_1.InventorySlot.armor)
        throw new Error(`render_armor(): can't render a ${i.slot}!`);
    const $node_quality = RichText.span().pushText(i.quality).done();
    const [min, max] = logic_armors_1.get_damage_reduction_interval(i);
    const $node_values = RichText.span()
        .addClass('armor--values')
        .pushText(`[${min} - ${max}]`)
        .done();
    const builder = RichText.span()
        .pushRawNode($node_quality, 'quality')
        .pushRawNode(render_armor_name(i), 'name')
        .pushRawNode($node_values, 'values');
    if (options.display_quality)
        builder.pushText('{{quality}} ');
    builder.pushText('{{name}}');
    if (options.display_values)
        builder.pushText(' {{values}}');
    return builder.done();
}
function render_armor_short(i, options = consts_1.DEFAULT_RENDER_ITEM_OPTIONS) {
    const $doc = render_armor(i, options);
    $doc.$classes = $doc.$classes || [];
    $doc.$classes.push('item', 'item--' + i.slot, 'item--quality--' + i.quality);
    return $doc;
}
exports.render_armor_short = render_armor_short;
function render_armor_detailed(i) {
    const $node_title = render_armor_short(i);
    const $node_quality = RichText.span()
        .addClass('item--quality--' + i.quality)
        .pushText(i.quality)
        .done();
    const $node_enhancement = RichText.span()
        .addClass('item--enhancement')
        .pushText(`${i.enhancement_level}/${logic_armors_1.MAX_ENHANCEMENT_LEVEL}`)
        .done();
    const [min, max] = logic_armors_1.get_damage_reduction_interval(i);
    const $node_values = RichText.span()
        .addClass('armor--values')
        .pushText(`absorbs damage: ${min} - ${max}`)
        .done();
    const builder = RichText.block_fragment()
        .pushNode($node_title, 'title')
        .pushLineBreak()
        .pushText('quality: ')
        .pushNode($node_quality, 'quality')
        .pushLineBreak()
        .pushText('enhancement: ')
        .pushNode($node_enhancement, 'enhancement')
        .pushLineBreak()
        .pushNode($node_values, 'values');
    return builder.done();
}
exports.render_armor_detailed = render_armor_detailed;
//# sourceMappingURL=items--armor.js.map