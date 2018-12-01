import { Armor } from '@oh-my-rpg/logic-armors';
import * as RichText from '@offirmo/rich-text-format';
import { RenderItemOptions } from './types';
declare function render_armor_short(i: Readonly<Armor>, options?: Readonly<RenderItemOptions>): RichText.Document;
declare function render_armor_detailed(i: Readonly<Armor>, reference_power?: number): RichText.Document;
export { render_armor_short, render_armor_detailed, };
