import { Node } from '../types';
import { WalkerCallbacks } from '../walk';
declare type State = string;
declare const callbacks: Partial<WalkerCallbacks<State>>;
declare function to_debug($doc: Node): string;
export { callbacks, to_debug };
