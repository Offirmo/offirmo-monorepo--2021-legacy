import { Adventure } from '@oh-my-rpg/state-the-boring-rpg';
import * as RichText from '@offirmo/rich-text-format';
import { RenderItemOptions } from './types';
declare function render_adventure(a: Adventure, options?: RenderItemOptions): RichText.Document;
export { render_adventure, };
