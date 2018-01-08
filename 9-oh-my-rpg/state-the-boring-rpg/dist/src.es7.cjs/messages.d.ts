import * as RichText from '@offirmo/rich-text-format';
import { State } from './types';
declare function get_recap(state: Readonly<State>): RichText.Document;
declare function get_tip(state: Readonly<State>): RichText.Document | null;
export { get_recap, get_tip };
