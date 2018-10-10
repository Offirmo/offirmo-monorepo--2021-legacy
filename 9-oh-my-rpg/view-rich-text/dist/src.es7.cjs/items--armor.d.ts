import { Armor } from '@oh-my-rpg/logic-armors';
import * as RichText from '@offirmo/rich-text-format';
import { RenderItemOptions } from './types';
declare function render_armor_short(i: Armor, options?: RenderItemOptions): RichText.Document;
declare function render_armor_detailed(i: Armor, reference_power?: number): RichText.Document;
export { render_armor_short, render_armor_detailed, };
