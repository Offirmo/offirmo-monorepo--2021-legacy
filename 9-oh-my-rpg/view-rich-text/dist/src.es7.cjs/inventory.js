"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const definitions_1 = require("@oh-my-rpg/definitions");
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
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
            : RichText.span().pushText('-').done();
        //const $doc_line = RichText.key_value(slot, $doc_item).done()
        const $doc_line = RichText.inline_fragment()
            .pushText(slot)
            .pushText(': ')
            .pushNode($doc_item, 'item')
            .done();
        $doc_list.$sub[definitions_1.ITEM_SLOTS_TO_INT[slot]] = $doc_line;
    });
    const $doc = RichText.block_fragment()
        .pushNode(RichText.heading().pushText('Active equipment:').done(), 'header')
        .pushNode($doc_list, 'list')
        .done();
    return $doc;
}
exports.render_equipment = render_equipment;
// we want the slots sorted by types according to an arbitrary order
// = nothing to do, the inventory is auto-sorted
function render_backpack(inventory, options) {
    let $doc_list = RichText.ordered_list()
        .addClass('inventory--backpack')
        .done();
    const misc_items = Array
        .from(state_inventory_1.iterables_unslotted(inventory))
        .filter(i => !!i);
    misc_items.forEach((i, index) => {
        if (!i)
            return;
        $doc_list.$sub[index + 1] = items_1.render_item_short(i, options);
    });
    if (Object.keys($doc_list.$sub).length === 0) {
        // completely empty
        $doc_list.$type = RichText.NodeType.ul;
        $doc_list.$sub['-'] = RichText.span().pushText('(empty)').done();
    }
    const $doc = RichText.block_fragment()
        .pushNode(RichText.heading().pushText('Backpack:').done(), 'header')
        .pushNode($doc_list, 'list')
        .done();
    return $doc;
}
exports.render_backpack = render_backpack;
function render_full_inventory(inventory, wallet, options = consts_1.DEFAULT_RENDER_ITEM_OPTIONS) {
    const $doc = RichText.block_fragment()
        .pushNode(render_equipment(inventory, options), 'equipped')
        .pushNode(wallet_1.render_wallet(wallet), 'wallet')
        .pushNode(render_backpack(inventory, options), 'backpack')
        .done();
    //console.log(JSON.stringify($doc, null, 2))
    return $doc;
}
exports.render_full_inventory = render_full_inventory;
//# sourceMappingURL=inventory.js.map