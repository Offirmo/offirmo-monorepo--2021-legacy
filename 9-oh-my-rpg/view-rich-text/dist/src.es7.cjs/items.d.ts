import { Item } from '@oh-my-rpg/definitions';
import * as RichText from '@offirmo/rich-text-format';
import { RenderItemOptions } from './types';
declare function render_item_short(i: Readonly<Item>, options?: Readonly<RenderItemOptions>): RichText.Document;
declare function render_item_detailed(i: Readonly<Item>): RichText.Document;
export { render_item_short, render_item_detailed, };
