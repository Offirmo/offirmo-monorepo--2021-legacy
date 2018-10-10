import { InventorySlot } from '@oh-my-rpg/definitions';
import { MAX_ENHANCEMENT_LEVEL, get_damage_reduction_interval as get_armor_damage_reduction_interval } from '@oh-my-rpg/logic-armors';
import * as RichText from '@offirmo/rich-text-format';
import { i18n_messages as I18N_ARMORS } from '@oh-my-rpg/logic-armors';
import { appraise_power, appraise_value } from '@oh-my-rpg/logic-shop';
import { DEFAULT_RENDER_ITEM_OPTIONS } from './consts';
/////////////////////
function push_quality(builder, i) {
    const $node = RichText.span().pushText(i.quality).done();
    return builder.pushNode($node, 'quality');
}
function push_values(builder, i, options = { short: false }) {
    const [min, max] = get_armor_damage_reduction_interval(i);
    const $node = RichText.span()
        .addClass('item--values')
        .pushText(options.short ? `[${min} - ${max}]` : `absorbs damage: ${min} - ${max}`)
        .done();
    return builder.pushNode($node, 'values');
}
function push_power(builder, i, options = { short: false }) {
    const power = appraise_power(i);
    if (!options.short) {
        const $node = RichText.span()
            .addClass('item--power')
            .pushText(`${power}`)
            .done();
        builder.pushNode($node, 'power');
    }
    if (options.reference_power) {
        if (power > options.reference_power) {
            const $node = RichText.span()
                .addClass('comparison--better')
                .pushText(`⬆`)
                .done();
            builder.pushNode($node, 'comparision');
        }
        else if (power < options.reference_power) {
            const $node = RichText.span()
                .addClass('comparison--worse')
                .pushText(`⬇`)
                .done();
            builder.pushNode($node, 'comparision');
        }
        else if (power < options.reference_power) {
            const $node = RichText.span()
                .addClass('comparison--equal')
                .pushText(`=`)
                .done();
            builder.pushNode($node, 'comparision');
        }
    }
    return builder;
}
function push_sell_value(builder, i) {
    const $node = RichText.span()
        .addClass('value--coin')
        .pushText(`${appraise_value(i)}`)
        .done();
    return builder.pushNode($node, 'sell-value');
}
/////////////////////
function render_armor_name(i) {
    const _ = I18N_ARMORS.en;
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
function render_armor_short(i, options = DEFAULT_RENDER_ITEM_OPTIONS) {
    if (i.slot !== InventorySlot.armor)
        throw new Error(`render_armor_short(): can't render a ${i.slot}!`);
    const builder = RichText.span();
    if (options.display_quality) {
        push_quality(builder, i);
        builder.pushText(' ');
    }
    builder.pushNode(render_armor_name(i), 'name');
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
function render_armor_detailed(i, reference_power) {
    if (i.slot !== InventorySlot.armor)
        throw new Error(`render_armor_detailed(): can't render a ${i.slot}!`);
    const $node_title = render_armor_short(i);
    const $node_enhancement = RichText.span()
        .addClass('item--enhancement')
        .pushText(`${i.enhancement_level}/${MAX_ENHANCEMENT_LEVEL}`)
        .done();
    const builder = RichText.block_fragment()
        .pushNode($node_title, 'title')
        .pushLineBreak();
    builder.pushText('Power: ');
    push_power(builder, i, { reference_power });
    builder.pushLineBreak();
    builder.pushText('quality: ');
    push_quality(builder, i);
    builder.pushLineBreak();
    builder
        .pushText('enhancement: ')
        .pushNode($node_enhancement, 'enhancement')
        .pushLineBreak();
    push_values(builder, i);
    builder.pushLineBreak();
    builder.pushText('Sell value: ');
    push_sell_value(builder, i);
    return builder.done();
}
export { render_armor_short, render_armor_detailed, };
//# sourceMappingURL=items--armor.js.map