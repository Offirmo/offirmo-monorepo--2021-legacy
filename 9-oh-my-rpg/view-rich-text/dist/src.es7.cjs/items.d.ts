import { Item } from '@oh-my-rpg/definitions';
import { Armor } from '@oh-my-rpg/logic-armors';
import { Weapon } from '@oh-my-rpg/logic-weapons';
import * as RichText from '@offirmo/rich-text-format';
declare function render_armor_name(i: Armor): RichText.Document;
declare function render_weapon_name(i: Weapon): RichText.Document;
interface RenderItemOptions {
    display_quality?: boolean;
    display_values?: boolean;
}
declare function render_armor(i: Armor, options?: RenderItemOptions): RichText.Document;
declare function render_weapon(i: Weapon, options?: RenderItemOptions): RichText.Document;
declare function render_item(i: Item, options?: RenderItemOptions): RichText.Document;
export { RenderItemOptions, render_armor_name, render_armor, render_weapon_name, render_weapon, render_item };
