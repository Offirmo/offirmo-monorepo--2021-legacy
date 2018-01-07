import { InventorySlot, Item, ITEM_SLOTS } from '@oh-my-rpg/definitions'
import { InventoryCoordinates, State as InventoryState, iterables_unslotted, get_item_in_slot } from '@oh-my-rpg/state-inventory'
import { State as WalletState } from '@oh-my-rpg/state-wallet'
import * as RichText from '@oh-my-rpg/rich-text-format'

import { render_item } from './items'
import { render_wallet } from './wallet'

function inventory_coordinate_to_sortable_alpha_index(coord: InventoryCoordinates): string {
	//return (' ' + (coord + 1)).slice(-2)
	return String.fromCharCode(97 + coord)
}

function render_equipment(inventory: InventoryState): RichText.Document {
	const $doc_list = RichText.unordered_list()
		.addClass('inventory--equipment')
		.done()

	ITEM_SLOTS.forEach((slot: InventorySlot) => {
		const item = get_item_in_slot(inventory, slot)
		const $doc_item = RichText.span()
			//.addClass('item--' + slot)
			.pushText((slot + '   ').slice(0, 6))
			.pushText(': ')
			.pushNode(item
				? render_item(item)
				: RichText.span().pushText('-').done()
			)
			.done()
		$doc_list.$sub[slot] = $doc_item
	})

	const $doc = RichText.section()
		.pushNode(RichText.heading().pushText('Active equipment:').done(), 'header')
		.pushNode($doc_list, 'list')
		.done()

	return $doc
}

function render_backpack(inventory: InventoryState): RichText.Document {
	let $doc_list = RichText.ordered_list()
		.addClass('inventory--backpack')
		.done()

	const misc_items = Array.from(iterables_unslotted(inventory))
	misc_items.forEach((i: Item, index: number) => {
		if (!i) return
		$doc_list.$sub[inventory_coordinate_to_sortable_alpha_index(index)] = render_item(i)
		// TODO add coordinates
	})

	if (Object.keys($doc_list.$sub).length === 0) {
		// completely empty
		$doc_list.$type = RichText.NodeType.ul
		$doc_list.$sub['-'] = RichText.span().pushText('(empty)').done()
	}

	const $doc = RichText.section()
		.pushNode(RichText.heading().pushText('backpack:').done(), 'header')
		.pushNode($doc_list, 'list')
		.done()

	return $doc
}

function render_full_inventory(inventory: InventoryState, wallet: WalletState): RichText.Document {
	const $doc = RichText.section()
		.pushNode(render_equipment(inventory), 'equipped')
		.pushLineBreak()
		.pushNode(render_wallet(wallet), 'wallet')
		.pushLineBreak()
		.pushNode(render_backpack(inventory), 'backpack')
		.done()

	return $doc
}

export {
	render_backpack,
	render_equipment,
	render_full_inventory,
}
