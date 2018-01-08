import { State as InventoryState } from '@oh-my-rpg/state-inventory';
import { State as WalletState } from '@oh-my-rpg/state-wallet';
import * as RichText from '@offirmo/rich-text-format';
declare function render_equipment(inventory: InventoryState): RichText.Document;
declare function render_backpack(inventory: InventoryState): RichText.Document;
declare function render_full_inventory(inventory: InventoryState, wallet: WalletState): RichText.Document;
export { render_backpack, render_equipment, render_full_inventory };
