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

import { render_item } from './items'
import { render_wallet } from './wallet'

// we want the slots sorted by types according to an arbitrary order
function render_equipment(inventory: InventoryState): RichText.Document {
	const $doc_list = RichText.ordered_list()
		.addClass('inventory--equipment')
		.done()

	ITEM_SLOTS.forEach((slot: InventorySlot, index: number) => {
		const item = get_item_in_slot(inventory, slot)

		const $doc_item = RichText.span()
			.pushText((slot + '   ').slice(0, 6))
			.pushText(': ')
			.pushNode(item
				? render_item(item)
				: RichText.span().pushText('-').done()
			)
			.done()

		$doc_list.$sub[ITEM_SLOTS_TO_INT[slot]] = $doc_item
	})

	const $doc = RichText.section()
		.pushNode(RichText.heading().pushText('Active equipment:').done(), 'header')
		.pushNode($doc_list, 'list')
		.done()

	return $doc
}

// we want the slots sorted by types according to an arbitrary order
// = nothing to do, the inventory is auto-sorted
function render_backpack(inventory: InventoryState): RichText.Document {
	let $doc_list = RichText.ordered_list()
		.addClass('inventory--backpack')
		.done()

	const misc_items: Item[] = Array.from(iterables_unslotted(inventory)).filter(i => !!i) as Item[]
	misc_items.forEach((i: Item, index: number) => {
		if (!i) return
		$doc_list.$sub[index] = render_item(i)
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
