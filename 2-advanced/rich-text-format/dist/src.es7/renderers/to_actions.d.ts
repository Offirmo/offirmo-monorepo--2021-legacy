import { WalkerCallbacks } from '../walk';
import { Node, CheckedNode } from '../types';
export interface Action {
    $node: CheckedNode;
    type: 'link' | undefined;
    data: any;
}
export declare type Options = {};
export declare const DEFAULT_OPTIONS: {};
declare type State = {
    actions: Action[];
};
declare const callbacks: Partial<WalkerCallbacks<State, Options>>;
declare function to_actions($doc: Node, options?: Options): Action[];
export { callbacks, to_actions, };
