import {
	InventorySlot,
	Item,
	ITEM_SLOTS,
	ITEM_SLOTS_TO_INT,
} from '@oh-my-rpg/definitions'

import {
	State as InventoryState,
	iterables_unslotted,
	get_item_in_slot,
} from '@oh-my-rpg/state-inventory'

import { State as WalletState } from '@oh-my-rpg/state-wallet'
import * as RichText from '@offirmo/rich-text-format'

import { render_item_short } from './items'
import { render_wallet } from './wallet'
import {RenderItemOptions} from "./types";
import {DEFAULT_RENDER_ITEM_OPTIONS} from "./consts";


// we want the slots sorted by types according to an arbitrary order
function render_equipment(inventory: InventoryState, options?: RenderItemOptions): RichText.Document {
	const $doc_list = RichText.unordered_list()
		.addClass('inventory--equipment')
		.done()

	ITEM_SLOTS.forEach((slot: InventorySlot) => {
		const item = get_item_in_slot(inventory, slot)

		const $doc_item = item
			? render_item_short(item, options)
			: RichText.span().pushText('-').done()

		//const $doc_line = RichText.key_value(slot, $doc_item).done()
		const $doc_line = RichText.inline_fragment()
			.pushText(slot)
			.pushText(': ')
			.pushNode($doc_item, 'item')
			.done()

		$doc_list.$sub[ITEM_SLOTS_TO_INT[slot]] = $doc_line
	})

	const $doc = RichText.block_fragment()
		.pushNode(RichText.heading().pushText('Active equipment:').done(), 'header')
		.pushNode($doc_list, 'list')
		.done()

	return $doc
}

// we want the slots sorted by types according to an arbitrary order
// = nothing to do, the inventory is auto-sorted
function render_backpack(inventory: InventoryState, options?: RenderItemOptions): RichText.Document {
	let $doc_list = RichText.ordered_list()
		.addClass('inventory--backpack')
		.done()

	const misc_items: Item[] = Array
		.from(iterables_unslotted(inventory))
		.filter(i => !!i) as Item[]

	misc_items.forEach((i: Item, index: number) => {
		if (!i) return
		$doc_list.$sub[index + 1] = render_item_short(i, options)
	})

	if (Object.keys($doc_list.$sub).length === 0) {
		// completely empty
		$doc_list.$type = RichText.NodeType.ul
		$doc_list.$sub['-'] = RichText.span().pushText('(empty)').done()
	}

	const $doc = RichText.block_fragment()
		.pushNode(RichText.heading().pushText('Backpack:').done(), 'header')
		.pushNode($doc_list, 'list')
		.done()

	return $doc
}

function render_full_inventory(inventory: InventoryState, wallet: WalletState, options: RenderItemOptions = DEFAULT_RENDER_ITEM_OPTIONS): RichText.Document {
	const $doc = RichText.block_fragment()
		.pushNode(render_equipment(inventory, options), 'equipped')
		.pushNode(render_wallet(wallet), 'wallet')
		.pushNode(render_backpack(inventory, options), 'backpack')
		.done()

	//console.log(JSON.stringify($doc, null, 2))
	return $doc
}

export {
	render_backpack,
	render_equipment,
	render_full_inventory,
}
