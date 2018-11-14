"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const definitions_1 = require("@oh-my-rpg/definitions");
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const logic_shop_1 = require("@oh-my-rpg/logic-shop");
const items_1 = require("./items");
const wallet_1 = require("./wallet");
const consts_1 = require("./consts");
// we want the slots sorted by types according to an arbitrary order
function render_equipment(inventory, options) {
    const $doc_list = RichText.unordered_list()
        .addClass('inventory--equipment')
        .done();
    definitions_1.ITEM_SLOTS.forEach((slot) => {
        const item = state_inventory_1.get_item_in_slot(inventory, slot);
        const $doc_item = item
            ? items_1.render_item_short(item, options)
            : RichText.inline_fragment().pushText('-').done();
        //const $doc_line = RichText.key_value(slot, $doc_item).done()
        const $doc_line = RichText.inline_fragment()
            .pushText(slot)
            .pushText(': ')
            .pushNode($doc_item, { id: 'item' })
            .done();
        $doc_list.$sub[`000${definitions_1.ITEM_SLOTS_TO_INT[slot]}`.slice(-3)] = $doc_line;
    });
    const $doc = RichText.block_fragment()
        .pushNode(RichText.heading().pushText('Active equipment:').done(), { id: 'header' })
        .pushNode($doc_list, { id: 'list' })
        .done();
    return $doc;
}
exports.render_equipment = render_equipment;
// we want the slots sorted by types according to an arbitrary order
// = nothing to do, the inventory is auto-sorted
function render_backpack(inventory, options) {
    const builder = RichText.ordered_list()
        .addClass('inventory--backpack');
    const misc_items = Array.from(state_inventory_1.iterables_unslotted(inventory))
        .filter(i => !!i);
    const item_count = misc_items.length;
    const reference_powers = {};
    misc_items.forEach((i) => {
        if (!reference_powers[i.slot]) {
            const item = state_inventory_1.get_item_in_slot(inventory, i.slot);
            reference_powers[i.slot] = item ? logic_shop_1.appraise_power(item) : 0;
        }
        builder.pushRawNode(items_1.render_item_short(i, Object.assign({}, options, { reference_power: reference_powers[i.slot] })));
    });
    const $doc_list = builder.done();
    if (Object.keys($doc_list.$sub).length === 0) {
        // completely empty
        $doc_list.$type = RichText.NodeType.ul;
        $doc_list.$sub['-'] = RichText.inline_fragment().pushText('(empty)').done();
    }
    const $doc = RichText.block_fragment()
        .pushNode(RichText.heading().pushText(`Backpack: (${item_count}/${inventory.unslotted_capacity})`).done(), { id: 'header' })
        .pushNode($doc_list, { id: 'list' })
        .done();
    return $doc;
}
exports.render_backpack = render_backpack;
function render_full_inventory(inventory, wallet, options = consts_1.DEFAULT_RENDER_ITEM_OPTIONS) {
    const $doc = RichText.block_fragment()
        .pushNode(render_equipment(inventory, options), { id: 'equipped' })
        .pushNode(wallet_1.render_wallet(wallet), { id: 'wallet' })
        .pushNode(render_backpack(inventory, options), { id: 'backpack' })
        .done();
    //console.log(JSON.stringify($doc, null, 2))
    return $doc;
}
exports.render_full_inventory = render_full_inventory;
//# sourceMappingURL=inventory.js.map