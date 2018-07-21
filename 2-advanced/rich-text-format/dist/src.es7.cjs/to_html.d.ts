import { WalkerCallbacks } from './walk';
import { Node } from './types';
declare type State = string;
declare const callbacks: Partial<WalkerCallbacks<State>>;
declare function to_html($doc: Node): string;
export { callbacks, to_html };
