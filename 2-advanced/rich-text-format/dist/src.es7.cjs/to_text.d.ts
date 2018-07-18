import { WalkerCallbacks } from './walk';
export declare type State = {
    starts_with_block: boolean;
    ends_with_block: boolean;
    str: string;
};
declare function assemble(state: State): string;
declare const callbacks: Partial<WalkerCallbacks<State>>;
export { assemble, callbacks, };
