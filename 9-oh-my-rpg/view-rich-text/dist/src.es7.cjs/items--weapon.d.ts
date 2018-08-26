import { Weapon } from '@oh-my-rpg/logic-weapons';
import * as RichText from '@offirmo/rich-text-format';
import { RenderItemOptions } from './types';
declare function render_weapon_name(i: Weapon): RichText.Document;
declare function render_weapon_short(i: Weapon, options?: RenderItemOptions): RichText.Document;
declare function render_weapon_detailed(i: Weapon): RichText.Document;
export { render_weapon_name, render_weapon_short, render_weapon_detailed, };
