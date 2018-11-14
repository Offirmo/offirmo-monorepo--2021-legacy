"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const definitions_1 = require("@oh-my-rpg/definitions");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const logic_weapons_2 = require("@oh-my-rpg/logic-weapons");
const logic_shop_1 = require("@oh-my-rpg/logic-shop");
const consts_1 = require("./consts");
/////////////////////
function push_quality(builder, i) {
    const $node = RichText.inline_fragment().pushText(i.quality).done();
    return builder.pushNode($node, { id: 'quality' });
}
function push_values(builder, i, options = { short: false }) {
    const [min, max] = logic_weapons_1.get_damage_interval(i);
    const $node = RichText.inline_fragment()
        .addClass('item--values')
        .pushText(options.short ? `[${min} - ${max}]` : `deals damage: ${min} - ${max}`)
        .done();
    return builder.pushNode($node, { id: 'values' });
}
function push_power(builder, i, options = { short: false }) {
    const power = logic_shop_1.appraise_power(i);
    if (!options.short) {
        const $node = RichText.inline_fragment()
            .addClass('item--power')
            .pushText(`${power}`)
            .done();
        builder.pushNode($node, { id: 'power' });
    }
    if (options.reference_power) {
        if (power > options.reference_power) {
            const $node = RichText.inline_fragment()
                .addClass('comparison--better')
                .pushText(`⬆`)
                .done();
            builder.pushNode($node, { id: 'comparision' });
        }
        else if (power < options.reference_power) {
            const $node = RichText.inline_fragment()
                .addClass('comparison--worse')
                .pushText(`⬇`)
                .done();
            builder.pushNode($node, { id: 'comparision' });
        }
        else if (power < options.reference_power) {
            const $node = RichText.inline_fragment()
                .addClass('comparison--equal')
                .pushText(`=`)
                .done();
            builder.pushNode($node, { id: 'comparision' });
        }
    }
    return builder;
}
function push_sell_value(builder, i) {
    const $node = RichText.inline_fragment()
        .addClass('value--coin')
        .pushText(`${logic_shop_1.appraise_value(i)}`)
        .done();
    return builder.pushNode($node, { id: 'sell-value' });
}
/////////////////////
function render_weapon_name(i) {
    if (i.slot !== definitions_1.InventorySlot.weapon)
        throw new Error(`render_weapon(): can't render a ${i.slot}!`);
    const _ = logic_weapons_2.i18n_messages.en;
    const b = _.weapon.base[i.base_hid];
    const q1 = _.weapon.qualifier1[i.qualifier1_hid];
    const q2 = _.weapon.qualifier2[i.qualifier2_hid];
    const builder = RichText.inline_fragment()
        .addClass('item__name')
        .pushText(q2.startsWith('of')
        ? '{{q1|Capitalize}} {{base|Capitalize}} {{q2|Capitalize}}'
        : '{{q2|Capitalize}} {{q1|Capitalize}} {{base|Capitalize}}');
    if (i.enhancement_level) {
        const $node_enhancement = RichText.inline_fragment()
            .addClass('item--enhancement')
            .pushText(`+${i.enhancement_level}`)
            .done();
        builder.pushText(' ').pushNode($node_enhancement, { id: 'enhancement' });
    }
    const $doc = builder.done();
    $doc.$sub.base = RichText.inline_fragment().pushText(b).done();
    $doc.$sub.q1 = RichText.inline_fragment().pushText(q1).done();
    $doc.$sub.q2 = RichText.inline_fragment().pushText(q2).done();
    return $doc;
}
exports.render_weapon_name = render_weapon_name;
function render_weapon_short(i, options = consts_1.DEFAULT_RENDER_ITEM_OPTIONS) {
    if (i.slot !== definitions_1.InventorySlot.weapon)
        throw new Error(`render_weapon_short(): can't render a ${i.slot}!`);
    const builder = RichText.inline_fragment();
    if (options.display_quality) {
        push_quality(builder, i);
        builder.pushText(' ');
    }
    builder.pushNode(render_weapon_name(i), { id: 'name' });
    if (options.display_values) {
        builder.pushText(' ');
        push_values(builder, i, { short: true });
    }
    if (options.display_power || options.reference_power) {
        builder.pushText(' ');
        push_power(builder, i, {
            short: !options.display_power,
            reference_power: options.reference_power
        });
    }
    if (options.display_sell_value) {
        builder.pushText(' ');
        push_sell_value(builder, i);
    }
    return builder
        .addClass('item', 'item--' + i.slot, 'item--quality--' + i.quality)
        .done();
}
exports.render_weapon_short = render_weapon_short;
function render_weapon_detailed(i, reference_power) {
    if (i.slot !== definitions_1.InventorySlot.weapon)
        throw new Error(`render_weapon_detailed(): can't render a ${i.slot}!`);
    const $node_title = render_weapon_short(i);
    const $node_enhancement = RichText.inline_fragment()
        .addClass('item--enhancement')
        .pushText(`${i.enhancement_level}/${logic_weapons_1.MAX_ENHANCEMENT_LEVEL}`)
        .done();
    const builder = RichText.block_fragment()
        .pushNode($node_title, { id: 'title' })
        .pushLineBreak();
    builder.pushText('Power: ');
    push_power(builder, i, { reference_power });
    builder.pushLineBreak();
    builder.pushText('quality: ');
    push_quality(builder, i);
    builder.pushLineBreak();
    builder
        .pushText('enhancement: ')
        .pushNode($node_enhancement, { id: 'enhancement' })
        .pushLineBreak();
    push_values(builder, i);
    builder.pushLineBreak();
    builder.pushText('Sell value: ');
    push_sell_value(builder, i);
    return builder.done();
}
exports.render_weapon_detailed = render_weapon_detailed;
//# sourceMappingURL=items--weapon.js.map