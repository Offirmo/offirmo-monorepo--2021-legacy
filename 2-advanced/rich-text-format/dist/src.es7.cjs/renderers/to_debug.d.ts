import { Node } from '../types';
import { WalkerCallbacks } from '../walk';
export declare type Options = {};
export declare const DEFAULT_OPTIONS: {};
declare type State = string;
declare const callbacks: Partial<WalkerCallbacks<State, Options>>;
declare function to_debug($doc: Node, options?: Options): string;
export { callbacks, to_debug };
