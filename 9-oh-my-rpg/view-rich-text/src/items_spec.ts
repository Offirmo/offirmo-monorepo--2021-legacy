import { expect } from 'chai'

import * as RichText from '@offirmo-private/rich-text-format'

import { InventorySlot, ItemQuality } from '@oh-my-rpg/definitions'
import { generate_random_demo_weapon, DEMO_WEAPON_1, DEMO_WEAPON_2 } from '@oh-my-rpg/logic-weapons'
import { generate_random_demo_armor, DEMO_ARMOR_1, DEMO_ARMOR_2 } from '@oh-my-rpg/logic-armors'

const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg/client-node/src/services/rich_text_to_ansi')

import { render_item_short } from '.'


describe('🔠  view to @offirmo-private/rich-text-format - item', function() {
	// TODO
})
