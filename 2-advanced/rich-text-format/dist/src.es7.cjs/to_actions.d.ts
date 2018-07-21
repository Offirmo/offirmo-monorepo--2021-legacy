import { WalkerCallbacks } from './walk';
import { Node } from './types';
export interface Action {
    type: 'link' | undefined;
    data: any;
}
export declare type State = {
    actions: Action[];
};
declare const callbacks: Partial<WalkerCallbacks<State>>;
declare function to_actions($doc: Node): Action[];
export { callbacks, to_actions, };
