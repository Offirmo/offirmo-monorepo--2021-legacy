import { WalkerCallbacks } from '../walk';
import { CheckedNode, Node } from '../types';
export declare type Options = {};
export declare const DEFAULT_OPTIONS: {};
declare type State = {
    sub_nodes: CheckedNode[];
    str: string;
};
declare const callbacks: Partial<WalkerCallbacks<State, Options>>;
declare function to_html($doc: Node, options?: Options): string;
export { callbacks, to_html };
