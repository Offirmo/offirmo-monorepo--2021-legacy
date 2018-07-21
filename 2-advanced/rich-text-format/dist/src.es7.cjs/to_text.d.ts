import { WalkerCallbacks } from './walk';
import { Node } from './types';
export declare type State = {
    starts_with_block: boolean;
    ends_with_block: boolean;
    str: string;
};
declare const callbacks: Partial<WalkerCallbacks<State>>;
declare function to_text($doc: Node): string;
export { callbacks, to_text, };
