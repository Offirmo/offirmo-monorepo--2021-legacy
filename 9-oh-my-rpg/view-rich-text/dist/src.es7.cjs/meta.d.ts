import { State } from '@oh-my-rpg/state-meta';
import * as RichText from '@offirmo/rich-text-format';
declare function render_account_info(m: State, extra?: {
    [k: string]: string | number | undefined;
}): RichText.Document;
export { render_account_info };
