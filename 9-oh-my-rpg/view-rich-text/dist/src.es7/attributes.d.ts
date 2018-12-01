import * as RichText from '@offirmo/rich-text-format';
import { State as CharacterState } from '@oh-my-rpg/state-character';
declare function render_avatar(state: Readonly<CharacterState>): RichText.Document;
declare function render_attributes(state: Readonly<CharacterState>): RichText.Document;
declare function render_character_sheet(state: Readonly<CharacterState>): RichText.Document;
export { render_avatar, render_attributes, render_character_sheet, };
