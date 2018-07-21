import { WalkerCallbacks } from '../walk';
import { CheckedNode, Node } from '../types';
declare type State = {
    sub_nodes: CheckedNode[];
    str: string;
};
declare const callbacks: Partial<WalkerCallbacks<State>>;
declare function to_html($doc: Node): string;
export { callbacks, to_html };
