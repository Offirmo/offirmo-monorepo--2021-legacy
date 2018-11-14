"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const definitions_1 = require("@oh-my-rpg/definitions");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const logic_armors_2 = require("@oh-my-rpg/logic-armors");
const logic_shop_1 = require("@oh-my-rpg/logic-shop");
const consts_1 = require("./consts");
/////////////////////
function push_quality(builder, i) {
    const $node = RichText.inline_fragment().pushText(i.quality).done();
    return builder.pushNode($node, { id: 'quality' });
}
function push_values(builder, i, options = { short: false }) {
    const [min, max] = logic_armors_1.get_damage_reduction_interval(i);
    const $node = RichText.inline_fragment()
        .addClass('item--values')
        .pushText(options.short ? `[${min} - ${max}]` : `absorbs damage: ${min} - ${max}`)
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
function render_armor_name(i) {
    const _ = logic_armors_2.i18n_messages.en;
    const b = _.armor.base[i.base_hid];
    const q1 = _.armor.qualifier1[i.qualifier1_hid];
    const q2 = _.armor.qualifier2[i.qualifier2_hid];
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
function render_armor_short(i, options = consts_1.DEFAULT_RENDER_ITEM_OPTIONS) {
    if (i.slot !== definitions_1.InventorySlot.armor)
        throw new Error(`render_armor_short(): can't render a ${i.slot}!`);
    const builder = RichText.inline_fragment();
    if (options.display_quality) {
        push_quality(builder, i);
        builder.pushText(' ');
    }
    builder.pushNode(render_armor_name(i), { id: 'name' });
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
exports.render_armor_short = render_armor_short;
function render_armor_detailed(i, reference_power) {
    if (i.slot !== definitions_1.InventorySlot.armor)
        throw new Error(`render_armor_detailed(): can't render a ${i.slot}!`);
    const $node_title = render_armor_short(i);
    const $node_enhancement = RichText.inline_fragment()
        .addClass('item--enhancement')
        .pushText(`${i.enhancement_level}/${logic_armors_1.MAX_ENHANCEMENT_LEVEL}`)
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
exports.render_armor_detailed = render_armor_detailed;
//# sourceMappingURL=items--armor.js.map