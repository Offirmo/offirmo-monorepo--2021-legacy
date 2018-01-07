import { NodeType, CheckedNode, Node } from './types';
interface BaseParams<State> {
    state: State;
    $node: CheckedNode;
    depth: number;
}
interface WalkerReducer<State, P extends BaseParams<State>> {
    (params: P): State;
}
interface AnyParams<State> extends BaseParams<State> {
    [x: string]: any;
}
interface WalkerCallbacks<State> {
    on_root_enter(): void;
    on_root_exit(params: BaseParams<State>): any;
    on_node_enter: any;
    on_node_exit: WalkerReducer<State, AnyParams<State>>;
    on_concatenate_str: WalkerReducer<State, AnyParams<State>>;
    on_concatenate_sub_node: WalkerReducer<State, AnyParams<State>>;
    on_filter: WalkerReducer<State, AnyParams<State>>;
    on_filter_Capitalize: WalkerReducer<State, AnyParams<State>>;
    on_class_before: WalkerReducer<State, AnyParams<State>>;
    on_class_after: WalkerReducer<State, AnyParams<State>>;
    on_type: WalkerReducer<State, AnyParams<State>>;
    [on_x: string]: any;
}
declare function walk<State>($raw_node: Node, raw_callbacks: Partial<WalkerCallbacks<State>>, {$parent_node, $id, depth}?: {
    $parent_node?: CheckedNode;
    $id?: string;
    depth?: number;
}): any;
export { NodeType, CheckedNode, Node, BaseParams, AnyParams, WalkerReducer, WalkerCallbacks, walk };
