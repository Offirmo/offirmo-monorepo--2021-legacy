import { Node, CheckedNode } from '../types';
import { WalkerCallbacks } from '../walk';
export declare type Options = {
    style: 'basic' | 'advanced' | 'markdown';
};
export declare const DEFAULT_OPTIONS: Options;
declare type State = {
    sub_nodes: CheckedNode[];
    starts_with_block: boolean;
    ends_with_block: boolean;
    margin_top: number;
    margin_bottom: number;
    str: string;
};
declare const callbacks: Partial<WalkerCallbacks<State, Options>>;
declare function to_text($doc: Node, options?: Options, callback_overrides?: Partial<WalkerCallbacks<State, Options>>): string;
export { callbacks, to_text, };
