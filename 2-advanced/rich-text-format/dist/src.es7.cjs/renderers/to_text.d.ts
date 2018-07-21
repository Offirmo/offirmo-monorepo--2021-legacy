import { Node, CheckedNode } from '../types';
import { WalkerCallbacks } from '../walk';
export declare type State = {
    sub_nodes: CheckedNode[];
    starts_with_block: boolean;
    ends_with_block: boolean;
    str: string;
};
declare const callbacks: Partial<WalkerCallbacks<State>>;
declare function to_text($doc: Node): string;
export { callbacks, to_text, };
