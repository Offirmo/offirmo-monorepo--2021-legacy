import { WalkerCallbacks } from '../walk';
import { Node, CheckedNode } from '../types';
export interface Action {
    $node: CheckedNode;
    type: 'link' | undefined;
    data: any;
}
export declare type State = {
    actions: Action[];
};
declare const callbacks: Partial<WalkerCallbacks<State>>;
declare function to_actions($doc: Node): Action[];
export { callbacks, to_actions, };
