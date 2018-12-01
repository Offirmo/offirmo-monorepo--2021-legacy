import { Monster } from '@oh-my-rpg/logic-monsters';
import * as RichText from '@offirmo/rich-text-format';
declare function render_monster(m: Readonly<Monster>): RichText.Document;
export { render_monster, };
