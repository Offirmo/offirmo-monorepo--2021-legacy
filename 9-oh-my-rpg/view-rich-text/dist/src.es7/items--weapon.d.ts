import { Weapon } from '@oh-my-rpg/logic-weapons';
import * as RichText from '@offirmo/rich-text-format';
import { RenderItemOptions } from './types';
declare function render_weapon_name(i: Readonly<Weapon>): RichText.Document;
declare function render_weapon_short(i: Readonly<Weapon>, options?: Readonly<RenderItemOptions>): RichText.Document;
declare function render_weapon_detailed(i: Readonly<Weapon>, reference_power?: number): RichText.Document;
export { render_weapon_name, render_weapon_short, render_weapon_detailed, };
